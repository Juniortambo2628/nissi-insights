<?php

namespace App\Mail;

use App\Models\EmailLog;
use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Blade;

class TemplatedMail extends Mailable implements ShouldQueue
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
            subject: $this->renderString($template->subject),
        );
    }

    public function content(): Content
    {
        $template = $this->getTemplate();

        return new Content(
            htmlString: $this->renderString($this->wrapInLayout($template->body)),
        );
    }

    public function attachments(): array
    {
        return [];
    }

    protected function getTemplate(): EmailTemplate
    {
        return EmailTemplate::active()->byKey($this->templateKey)->firstOrFail();
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
