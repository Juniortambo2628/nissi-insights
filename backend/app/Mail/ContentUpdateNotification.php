<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\EmailTemplate;

class ContentUpdateNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $typeLabel; // Insight or Case Study
    public $categoryLabel;
    public $title;
    public $excerpt;
    public $url;
    public $imageUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($typeLabel, $categoryLabel, $title, $excerpt, $url, $imageUrl = null)
    {
        $this->typeLabel = $typeLabel;
        $this->categoryLabel = $categoryLabel;
        $this->title = $title;
        $this->excerpt = $excerpt;
        $this->url = $url;
        $this->imageUrl = $imageUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New {$this->typeLabel}: {$this->title} - Nissi Insights",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if ($content = EmailTemplate::renderIfExists('content_update_notification', [
            'typeLabel' => $this->typeLabel,
            'categoryLabel' => $this->categoryLabel,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'url' => $this->url,
            'imageUrl' => $this->imageUrl,
        ])) {
            return $content;
        }

        return new Content(
            view: 'emails.content-update',
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
