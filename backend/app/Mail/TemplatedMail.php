<?php

namespace App\Mail;

use App\Models\EmailLog;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Blade;

/**
 * Synchronous templated mailable.
 *
 * Note: this intentionally does NOT implement ShouldQueue. In Laravel, a
 * mailable that implements ShouldQueue is automatically queued when Mail::send()
 * is used, which means emails only dispatch if a queue worker is running. On
 * this shared-hosting deployment there is no queue worker, so all callers expect
 * Mail::to()->send() to deliver immediately.
 */
class TemplatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $templateKey,
        public array $data = [],
        public ?object $sendable = null
    ) {}

    public function envelope(): Envelope
    {
        $template = $this->getTemplate();

        return new Envelope(
            subject: html_entity_decode(
                $template
                    ? $this->renderString($template->subject)
                    : "Nissi Insights Notification (template {$this->templateKey})",
                ENT_QUOTES,
                'UTF-8'
            ),
        );
    }

    public function content(): Content
    {
        $template = $this->getTemplate();

        if ($template) {
            $html = $this->renderString($this->wrapInLayout($template->body));

            return new Content(
                htmlString: $html,
                text: $this->plainText($html),
            );
        }

        $html = $this->renderString($this->wrapInLayout($this->fallbackBody()));

        return new Content(
            htmlString: $html,
            text: $this->plainText($html),
        );
    }

    public function attachments(): array
    {
        return [];
    }

    public function headers(): Headers
    {
        return new Headers(
            messageId: $this->generateMessageId(),
            text: [
                'X-Mailer' => 'NissiInsightsMailer/1.0',
                'X-Priority' => '3',
            ],
        );
    }

    protected function generateMessageId(): string
    {
        $appUrl = config('app.url') ?: 'https://nissi-insights.com';
        $host = parse_url($appUrl, PHP_URL_HOST) ?: 'nissi-insights.com';

        return '<' . uniqid('nissi_', true) . '@' . $host . '>';
    }

    protected function getTemplate(): ?EmailTemplate
    {
        return EmailTemplate::active()->byKey($this->templateKey)->first();
    }

    protected function fallbackBody(): string
    {
        return <<<'BLADE'
<h1>Notification</h1>
<p>Hi {{ $name ?? 'there' }},</p>
<p>This is a notification from Nissi Insights.</p>

<div class="event-card">
    @if(!empty($eventImage))
    <img src="{{ $eventImage }}" alt="{{ $eventTitle ?? 'Event' }}" class="event-image">
    @endif
    <div class="event-details">
        @if(!empty($eventTitle))
        <div class="detail-row"><strong>Event:</strong> {{ $eventTitle }}</div>
        @endif
        @if(!empty($eventDate))
        <div class="detail-row"><strong>Date:</strong> {{ $eventDate }}</div>
        @endif
        @if(!empty($eventTime))
        <div class="detail-row"><strong>Time:</strong> {{ $eventTime }}</div>
        @endif
        @if(!empty($eventLocation))
        <div class="detail-row"><strong>Location:</strong> {{ $eventLocation }}</div>
        @endif
    </div>
</div>

<p style="color: #64748b; font-size: 12px; margin-top: 24px;">Note: the email template "{{ $templateKey ?? '' }}" is missing or inactive. Please check Admin &rarr; Email Configuration.</p>
BLADE;
    }

    protected function renderString(string $content): string
    {
        return Blade::render($content, $this->data);
    }

    protected function plainText(string $html): string
    {
        $text = preg_replace('/<style\b[^>]*>[\s\S]*?<\/style>/i', '', $html);
        $text = preg_replace('/<script\b[^>]*>[\s\S]*?<\/script>/i', '', $text);
        $text = preg_replace('/<br\s*\/?>/i', "\n", $text);
        $text = preg_replace('/<\/p>/i', "\n\n", $text);
        $text = preg_replace('/<[^>]+>/', ' ', $text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\n{3,}/', "\n\n", $text);

        return trim($text);
    }

    protected function wrapInLayout(string $body): string
    {
        if (str_contains($body, '<html')) {
            return $body;
        }

        return view('emails.layout', ['content' => $body])->render();
    }

    /**
     * Log the send attempt. This is called manually after send() so we can
     * capture success or failure and link it to the related model.
     */
    public function log(string $recipient, string $status, ?string $error = null): EmailLog
    {
        $log = new EmailLog([
            'template_key' => $this->templateKey,
            'recipient' => $recipient,
            'status' => $status,
            'error' => $error,
            'sent_at' => $status === 'sent' ? now() : null,
        ]);

        if ($this->sendable) {
            $log->sendable()->associate($this->sendable);
        }

        $log->save();

        return $log;
    }
}
