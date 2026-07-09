<?php

namespace App\Mail;

use App\Models\EmailLog;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
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
            subject: $template
                ? $this->renderString($template->subject)
                : "Nissi Insights Notification (template {$this->templateKey})",
        );
    }

    public function content(): Content
    {
        $template = $this->getTemplate();

        if ($template) {
            return new Content(
                htmlString: $this->renderString($this->wrapInLayout($template->body)),
            );
        }

        return new Content(
            htmlString: $this->renderString($this->wrapInLayout($this->fallbackBody())),
        );
    }

    public function attachments(): array
    {
        return [];
    }

    protected function getTemplate(): ?EmailTemplate
    {
        return EmailTemplate::active()->byKey($this->templateKey)->first();
    }

    protected function fallbackBody(): string
    {
        return <<<'BLADE'
<div style="padding: 20px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <p>Hi {{ $name ?? 'there' }},</p>
    <p>This is a notification from Nissi Insights.</p>

    @if(!empty($eventTitle))
    <p><strong>Event:</strong> {{ $eventTitle }}</p>
    @endif
    @if(!empty($eventDate))
    <p><strong>Date:</strong> {{ $eventDate }}</p>
    @endif
    @if(!empty($eventTime))
    <p><strong>Time:</strong> {{ $eventTime }}</p>
    @endif

    <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Note: the email template "{{ $templateKey ?? '' }}" is missing or inactive. Please check Admin &rarr; Email Configuration.</p>
</div>
BLADE;
    }

    protected function renderString(string $content): string
    {
        return Blade::render($content, $this->data);
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
