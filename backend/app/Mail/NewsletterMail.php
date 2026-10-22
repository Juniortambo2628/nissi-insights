<?php

namespace App\Mail;

use App\Models\Campaign;
use App\Models\EmailLog;
use App\Models\Newsletter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

/**
 * Synchronous newsletter mailable (see TemplatedMail for why queueing is
 * intentionally avoided on this deployment).
 */
class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Newsletter $newsletter,
        public Campaign $campaign,
        public string $recipientEmail,
        public ?string $recipientName = null,
        public ?string $unsubscribeUrl = null
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->campaign->subject ?: $this->newsletter->subject;

        return new Envelope(
            subject: html_entity_decode($subject, ENT_QUOTES, 'UTF-8'),
            to: $this->recipientEmail,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter',
            with: [
                'newsletter' => $this->newsletter,
                'recipientName' => $this->recipientName,
                'unsubscribeUrl' => $this->unsubscribeUrl,
                'contentHtml' => $this->newsletter->renderedContent(),
                'headerImageUrl' => $this->newsletter->absoluteUrl($this->newsletter->header_image),
            ],
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
                'List-Unsubscribe' => $this->unsubscribeUrl,
                'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
            ],
        );
    }

    protected function generateMessageId(): string
    {
        $appUrl = config('app.url') ?: 'https://nissi-insights.com';
        $host = parse_url($appUrl, PHP_URL_HOST) ?: 'nissi-insights.com';

        return uniqid('nissi_nl_', true).'@'.$host;
    }

    /**
     * Log the send attempt against the campaign, mirroring TemplatedMail::log().
     */
    public function log(string $recipient, string $status, ?string $error = null): EmailLog
    {
        $log = new EmailLog([
            'template_key' => 'newsletter',
            'recipient' => $recipient,
            'status' => $status,
            'error' => $error,
            'sent_at' => $status === 'sent' ? now() : null,
        ]);

        $log->sendable()->associate($this->campaign);
        $log->save();

        return $log;
    }
}
