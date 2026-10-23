<?php

use App\Models\Newsletter;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

/**
 * Fixture mirrors the real distorted newsletter: a giant top-level editor
 * table wrapping boxed sections, plus stacked nested data tables used as a
 * team-layout workaround.
 */
function giantTableWithBoxes(): string
{
    return '<p>Intro paragraph</p>'
        .'<table class="ni-table"><colgroup><col style="min-width:25px"></colgroup><tbody><tr><td>'
        .'<div data-ni-box="" data-label="Bulletin" style="background:rgba(148,163,184,0.08);">'
        .'<table role="presentation"><tr><td style="padding:18px 20px;">'
        .'<div style="font-size:11px;">BULLETIN</div><p>Box body text</p>'
        .'</td></tr></table></div>'
        .'<div data-ni-box="" data-label="A Note From Us">'
        .'<table role="presentation"><tr><td><p>Note body</p></td></tr></table></div>'
        .'</td></tr></tbody></table>';
}

function stackedNestedTables(): string
{
    return '<div data-ni-box="" data-label="Team">'
        .'<table role="presentation"><tr><td>'
        .'<table class="ni-table"><tbody><tr><td>'
        .'<table class="ni-table"><tbody><tr><td>Jane Doe</td></tr></tbody></table>'
        .'</td></tr></tbody></table>'
        .'</td></tr></table></div>';
}

/** Non-presentation tables that still contain a table or a block wrapper. */
function problemTables(string $html): array
{
    $doc = new DOMDocument;
    $previous = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8" ?><div id="root">'.$html.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    $xpath = new DOMXPath($doc);
    $root = $xpath->query('//*[@id="root"]')->item(0);
    if (! $root instanceof DOMElement) {
        return [];
    }

    $problems = [];
    foreach ($root->getElementsByTagName('table') as $table) {
        if (strtolower($table->getAttribute('role')) === 'presentation') {
            continue;
        }
        if ($table->getElementsByTagName('table')->length > 0) {
            $problems[] = $table;

            continue;
        }
        foreach ($table->getElementsByTagName('div') as $div) {
            foreach ($div->attributes as $attr) {
                if (str_starts_with($attr->nodeName, 'data-ni-') || $attr->nodeName === 'data-content-ref') {
                    $problems[] = $table;
                    break 2;
                }
            }
        }
    }

    return $problems;
}

it('flattens a giant data table that wraps boxed sections on render', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'content' => giantTableWithBoxes(),
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->toContain('data-ni-box');
    expect($rendered)->toContain('Box body text');
    expect($rendered)->toContain('Note body');
    expect(problemTables($rendered))->toBeEmpty();
});

it('flattens stacked nested data tables inside a box on render', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'content' => stackedNestedTables(),
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->toContain('Jane Doe');
    expect($rendered)->toContain('data-ni-box');
    expect(problemTables($rendered))->toBeEmpty();
});

it('leaves clean data tables and presentation tables untouched', function () {
    $clean = '<table class="ni-table"><tbody><tr><th>Market</th><th>Status</th></tr>'
        .'<tr><td>Kenya</td><td>Open</td></tr></tbody></table>'
        .'<div data-ni-stats="" data-items="{&quot;value&quot;:&quot;14&quot;}">'
        .'<table role="presentation"><tr><td>14</td></tr></table></div>';

    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'content' => $clean,
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->toContain('<th>Market</th>');
    expect($rendered)->toContain('Kenya');
    expect($rendered)->toContain('data-ni-stats');
    expect(problemTables($rendered))->toBeEmpty();
});

it('strips empty paragraphs and editor chrome classes on render', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'content' => '<p></p><p><br></p><p style="color:#333"></p><p>Keep me</p>'
            .'<img src="uploads/photo.jpg" alt="" class="rounded-lg max-w-full h-auto">'
            .'<a href="https://example.com" class="text-primary hover:underline cursor-pointer">Link</a>',
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->not->toContain('<p></p>');
    expect($rendered)->not->toContain('<p><br></p>');
    expect($rendered)->not->toContain('<p style="color:#333"></p>');
    expect($rendered)->toContain('Keep me');
    expect($rendered)->not->toContain('rounded-lg');
    expect($rendered)->not->toContain('hover:underline');
    expect($rendered)->toContain('href="https://example.com"');
    expect($rendered)->toContain('api/storage/photo.jpg');
});

it('repairs distorted content without losing block markup or colours', function () {
    $newsletter = Newsletter::factory()->create([
        'user_id' => $this->user->id,
        'accent_color' => '#d97706',
        'content' => giantTableWithBoxes().'<p style="color:var(--ni-accent,#2563eb)">Accent paragraph</p>',
    ]);

    $rendered = $newsletter->renderedContent();

    expect($rendered)->not->toContain('var(--ni-accent');
    expect($rendered)->toContain('#d97706');
    expect($rendered)->toContain('Accent paragraph');
    expect(problemTables($rendered))->toBeEmpty();
});
