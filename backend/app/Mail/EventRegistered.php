<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

use App\Models\EventRegistration;

class EventRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $registration;

    public function __construct(EventRegistration $registration)
    {
        $this->registration = $registration;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Registration Confirmed: ' . $this->registration->event->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.event-registered',
            with: [
                'name' => $this->registration->name,
                'eventTitle' => $this->registration->event->title,
                'eventDate' => $this->registration->event->date->format('F j, Y, g:i a'),
                'eventLocation' => $this->registration->event->location,
            ],
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
