<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Newsletter extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_SENT = 'sent';

    public const MAX_REVISIONS = 20;

    public const REVISION_FIELDS = [
        'title',
        'subject',
        'preheader',
        'content',
        'header_image',
        'background_color',
        'text_color',
        'accent_color',
    ];

    protected $fillable = [
        'user_id',
        'title',
        'subject',
        'preheader',
        'content',
        'header_image',
        'background_color',
        'text_color',
        'accent_color',
        'status',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function revisions()
    {
        return $this->hasMany(NewsletterRevision::class);
    }

    protected static function booted(): void
    {
        static::deleting(function (Newsletter $newsletter) {
            if (Schema::hasTable('newsletter_revisions')) {
                $newsletter->revisions()->delete();
            }
        });
    }

    public function recordRevision(?string $source, ?int $userId): ?NewsletterRevision
    {
        $allowed = [
            NewsletterRevision::SOURCE_MANUAL,
            NewsletterRevision::SOURCE_AUTOSAVE,
            NewsletterRevision::SOURCE_RESTORE,
        ];

        if (! in_array($source, $allowed, true) || ! Schema::hasTable('newsletter_revisions')) {
            return null;
        }

        $payload = $this->only(self::REVISION_FIELDS);
        $latest = $this->revisions()->orderByDesc('id')->first();

        if ($latest && $latest->payload == $payload) {
            return null;
        }

        if ($source === NewsletterRevision::SOURCE_AUTOSAVE
            && $latest
            && $latest->created_at->gt(now()->subMinutes(5))) {
            return null;
        }

        $revision = $this->revisions()->create([
            'user_id' => $userId,
            'source' => $source,
            'payload' => $payload,
        ]);

        $allIds = $this->revisions()->orderByDesc('id')->pluck('id');
        $expiredIds = $allIds->slice(self::MAX_REVISIONS);

        if ($expiredIds->isNotEmpty()) {
            NewsletterRevision::whereIn('id', $expiredIds)->delete();
        }

        return $revision;
    }

    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    public function scopeSent($query)
    {
        return $query->where('status', self::STATUS_SENT);
    }

    /**
     * Resolve a stored path or URL to an absolute URL usable inside emails.
     */
    public function absoluteUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        $clean = ltrim($path, '/');

        if (str_starts_with($clean, 'uploads/') || str_starts_with($clean, 'storage/')) {
            return config('app.url').'/api/storage/'.preg_replace('#^storage/#', '', $clean);
        }

        return frontend_url('/'.$clean);
    }

    /**
     * Newsletter HTML with relative upload paths rewritten to absolute URLs
     * so images render correctly in email clients, and editor color tokens
     * (var(--ni-accent,#2563eb) etc.) resolved to the newsletter's colors.
     */
    public function renderedContent(): string
    {
        $content = (string) $this->content;
        $appUrl = config('app.url');

        $content = preg_replace_callback(
            '#\b(src|href)="([^"]*uploads/[^"]*)"#i',
            function ($matches) use ($appUrl) {
                $url = $matches[2];

                if (filter_var($url, FILTER_VALIDATE_URL) || str_starts_with($url, 'data:')) {
                    return $matches[0];
                }

                $clean = ltrim($url, '/');
                $absolute = $appUrl.'/api/storage/'.preg_replace('#^(uploads|storage)/#', '', $clean);

                return $matches[1].'="'.$absolute.'"';
            },
            $content
        ) ?? $content;

        $content = $this->repairContentStructure($content);
        $content = $this->stripEditorChrome($content);

        return $this->resolveColorTokens($content);
    }

    /**
     * Flatten table distortions in legacy content before it is emailed:
     * data tables nested inside data tables, and block wrappers (boxes,
     * grids, stats…) trapped inside a data table. Mirrors the frontend
     * repair in lib/newsletter-repair.ts so content that is sent without
     * being re-opened in the editor still renders correctly.
     */
    protected function repairContentStructure(string $html): string
    {
        if (stripos($html, '<table') === false) {
            return $html;
        }

        $doc = new \DOMDocument;
        $previous = libxml_use_internal_errors(true);
        $loaded = $doc->loadHTML(
            '<?xml encoding="utf-8" ?><div id="ni-root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $loaded) {
            return $html;
        }

        $xpath = new \DOMXPath($doc);
        $root = $xpath->query('//*[@id="ni-root"]')->item(0);
        if (! $root instanceof \DOMElement) {
            return $html;
        }

        for ($round = 0; $round < 10; $round++) {
            $bad = null;
            foreach ($root->getElementsByTagName('table') as $table) {
                if (strtolower($table->getAttribute('role')) === 'presentation') {
                    continue;
                }
                if ($this->tableNeedsRepair($table)) {
                    $bad = $table;
                    break;
                }
            }
            if (! $bad) {
                break;
            }
            $this->unwrapTable($bad);
        }

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }

        return $out !== '' ? $out : $html;
    }

    /**
     * A non-presentation table needs repair when it contains another table
     * (any role) or a block wrapper (div[data-ni-*] / div[data-content-ref]).
     */
    protected function tableNeedsRepair(\DOMElement $table): bool
    {
        if ($table->getElementsByTagName('table')->length > 0) {
            return true;
        }

        foreach ($table->getElementsByTagName('div') as $div) {
            foreach ($div->attributes as $attr) {
                if (str_starts_with($attr->nodeName, 'data-ni-') || $attr->nodeName === 'data-content-ref') {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Replace a table with the contents of its outermost cells, in order.
     */
    protected function unwrapTable(\DOMElement $table): void
    {
        $parent = $table->parentNode;
        if (! $parent) {
            return;
        }

        $cells = [];
        foreach ($table->getElementsByTagName('tr') as $row) {
            foreach ($row->childNodes as $child) {
                if ($child instanceof \DOMElement && in_array($child->nodeName, ['td', 'th'], true)) {
                    $cells[] = $child;
                }
            }
        }

        $outermost = array_values(array_filter($cells, function ($cell) use ($cells) {
            foreach ($cells as $other) {
                if ($other === $cell) {
                    continue;
                }
                for ($up = $cell->parentNode; $up !== null; $up = $up->parentNode) {
                    if ($up === $other) {
                        return false;
                    }
                }
            }

            return true;
        }));

        foreach ($outermost as $cell) {
            while ($cell->firstChild) {
                $parent->insertBefore($cell->firstChild, $table);
            }
        }

        $parent->removeChild($table);
    }

    /**
     * Remove empty paragraphs and editor chrome classes that mean nothing
     * in an email. Inline styles (colours, sizing) are left untouched.
     */
    protected function stripEditorChrome(string $html): string
    {
        $html = preg_replace('#<p(\s[^>]*)?>\s*(?:<br\s*/?>)?\s*</p>#i', '', $html) ?? $html;

        return str_replace(
            [' class="rounded-lg max-w-full h-auto"', ' class="text-primary hover:underline cursor-pointer"'],
            ['', ''],
            $html
        );
    }

    /**
     * Replace CSS color variables used by inserted blocks with literal
     * colors, since email clients do not support custom properties.
     */
    protected function resolveColorTokens(string $content): string
    {
        $tokens = [
            '--ni-accent' => $this->accent_color ?: '#2563eb',
            '--ni-text' => $this->text_color ?: '#0f172a',
            '--ni-bg' => $this->background_color ?: '#ffffff',
        ];

        $replaced = preg_replace_callback(
            '/var\(\s*(--ni-accent|--ni-text|--ni-bg)\s*(?:,\s*[^)]*)?\)/',
            function ($matches) use ($tokens) {
                return $tokens[$matches[1]] ?? $matches[0];
            },
            $content
        );

        return $replaced ?? $content;
    }
}
