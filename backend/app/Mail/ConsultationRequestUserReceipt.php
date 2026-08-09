<?php

namespace App\Mail;

use App\Models\EmailTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConsultationRequestUserReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public $requestData;

    /**
     * Create a new message instance.
     */
    public function __construct($requestData)
    {
        $this->requestData = $requestData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: EmailTemplate::subjectIfExists(
                'consultation_request_user',
                ['requestData' => $this->requestData],
                'We Received Your Request: '.($this->requestData->subject ?? 'Consultation Inquiry')
            ),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($content = EmailTemplate::renderIfExists('consultation_request_user', ['requestData' => $this->requestData])) {
            return $content;
        }

        $customTemplate = \App\Models\SiteSetting::where('key', 'email_template_user')->first();

        if ($customTemplate && ! empty($customTemplate->value)) {
            if (! str_contains($customTemplate->value, '@extends')) {
                return new Content(
                    view: 'emails.dynamic',
                    with: [
                        'dynamicContent' => \Illuminate\Support\Facades\Blade::render($customTemplate->value, ['requestData' => $this->requestData]),
                    ]
                );
            } else {
                return new Content(
                    htmlString: \Illuminate\Support\Facades\Blade::render($customTemplate->value, ['requestData' => $this->requestData])
                );
            }
        }

        return new Content(
            view: 'emails.consultation-user-receipt',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
