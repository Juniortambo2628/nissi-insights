<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'key' => 'event_registered_client',
                'name' => 'Event Registration - Client',
                'subject' => 'Registration Confirmed: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<p>Hi {{ $name }},</p>
<p>You have successfully registered for <strong>{{ $eventTitle }}</strong>.</p>

<div class="event-card">
    @if($eventImage)
    <img src="{{ $eventImage }}" alt="{{ $eventTitle }}" class="event-image">
    @endif
    <div class="event-details">
        <div class="detail-row"><strong>Date:</strong> {{ $eventDate }}</div>
        <div class="detail-row"><strong>Time:</strong> {{ $eventTime }}</div>
        <div class="detail-row"><strong>Location:</strong> {{ $eventLocation }}</div>
    </div>
</div>

@if($eventLink)
<p>
    <a href="{{ $eventLink }}" class="button">Access Event</a>
</p>
@endif

<p>We look forward to seeing you there!</p>
<p>Thanks,<br>{{ config('app.name') }}</p>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventDate', 'eventTime', 'eventLocation', 'eventLink', 'eventImage'],
            ],
            [
                'key' => 'event_registered_admin',
                'name' => 'Event Registration - Admin Alert',
                'subject' => 'New Registration: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">New Event Registration</h1>
    <p>A new participant has registered for <strong>{{ $eventTitle }}</strong>.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Name:</strong> {{ $name }}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> {{ $email }}</p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> {{ $phone ?: '—' }}</p>
        <p style="margin: 0;"><strong>Organization:</strong> {{ $organization ?: '—' }}</p>
    </div>

    <p>
                    <a href="{{ frontend_url('/admin/registrations?event_id=' . $eventId) }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Registrations</a>
    </p>
</div>
BLADE,
                'variables' => ['eventTitle', 'name', 'email', 'phone', 'organization', 'eventId'],
            ],
            [
                'key' => 'event_reminder_approaching',
                'name' => 'Event Reminder - Approaching',
                'subject' => 'Starting Soon: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<h1>Starting Soon</h1>
<p>Hi {{ $name }},</p>
<p>This is a friendly reminder that <strong>{{ $eventTitle }}</strong> is starting soon.</p>

<div class="event-card">
    @if($eventImage)
    <img src="{{ $eventImage }}" alt="{{ $eventTitle }}" class="event-image">
    @endif
    <div class="event-details">
        <div class="detail-row"><strong>Date:</strong> {{ $eventDate }}</div>
        <div class="detail-row"><strong>Time:</strong> {{ $eventTime }}</div>
        <div class="detail-row"><strong>Location:</strong> {{ $eventLocation }}</div>
    </div>
</div>

@if($eventLink)
<p>
    <a href="{{ $eventLink }}" class="button">Join Event</a>
</p>
@endif

<p>See you there!</p>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventDate', 'eventTime', 'eventLocation', 'eventLink', 'eventImage'],
            ],
            [
                'key' => 'event_reminder_started',
                'name' => 'Event Reminder - Started',
                'subject' => 'Live Now: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<h1>We're Live</h1>
<p>Hi {{ $name }},</p>
<p><strong>{{ $eventTitle }}</strong> is starting right now.</p>

<div class="event-card">
    @if($eventImage)
    <img src="{{ $eventImage }}" alt="{{ $eventTitle }}" class="event-image">
    @endif
    <div class="event-details">
        <div class="detail-row"><strong>Date:</strong> {{ $eventDate }}</div>
        <div class="detail-row"><strong>Time:</strong> {{ $eventTime }}</div>
        <div class="detail-row"><strong>Location:</strong> {{ $eventLocation }}</div>
    </div>
</div>

@if($eventLink)
<p>
    <a href="{{ $eventLink }}" class="button">Join Now</a>
</p>
@else
<p>Please check your calendar for the joining details.</p>
@endif

<p>See you inside!</p>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventLink', 'eventDate', 'eventTime', 'eventLocation', 'eventImage'],
            ],
            [
                'key' => 'event_thank_you_ended',
                'name' => 'Event Thank You - Ended',
                'subject' => 'Thank You for Attending: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<h1>Thank You for Attending</h1>
<p>Hi {{ $name }},</p>
<p>Thank you for joining us at <strong>{{ $eventTitle }}</strong>. We hope you found the session insightful and valuable.</p>

<div class="event-card">
    @if($eventImage)
    <img src="{{ $eventImage }}" alt="{{ $eventTitle }}" class="event-image">
    @endif
    <div class="event-details">
        <div class="detail-row"><strong>Date:</strong> {{ $eventDate }}</div>
        <div class="detail-row"><strong>Time:</strong> {{ $eventTime }}</div>
        <div class="detail-row"><strong>Location:</strong> {{ $eventLocation }}</div>
    </div>
</div>

@if($eventLink)
<p>
    <a href="{{ $eventLink }}" class="button">Access Resources</a>
</p>
@endif

<p>If you have any further questions or would like to discuss our services, feel free to reach out.</p>
<p>Best regards,<br>{{ config('app.name') }}</p>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventLink', 'eventDate', 'eventTime', 'eventLocation', 'eventImage'],
            ],
            [
                'key' => 'event_attended_thank_you',
                'name' => 'Event Attendance - Manual Thank You',
                'subject' => 'Thank You for Attending: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<h1>Thank You for Attending</h1>
<p>Hi {{ $name }},</p>
<p>Thank you for attending <strong>{{ $eventTitle }}</strong>. It was a pleasure having you with us.</p>

<div class="event-card">
    @if($eventImage)
    <img src="{{ $eventImage }}" alt="{{ $eventTitle }}" class="event-image">
    @endif
    <div class="event-details">
        <div class="detail-row"><strong>Date:</strong> {{ $eventDate }}</div>
        <div class="detail-row"><strong>Time:</strong> {{ $eventTime }}</div>
        <div class="detail-row"><strong>Location:</strong> {{ $eventLocation }}</div>
    </div>
</div>

@if($eventLink)
<p>
    <a href="{{ $eventLink }}" class="button">Access Resources</a>
</p>
@endif

<p>We hope to see you at future events.</p>
<p>Best regards,<br>{{ config('app.name') }}</p>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventLink', 'eventDate', 'eventTime', 'eventLocation', 'eventImage'],
            ],

            // Consultation requests
            [
                'key' => 'consultation_request_user',
                'name' => 'Consultation Request - User Receipt',
                'subject' => 'We Received Your Request: {{ $requestData->subject ?? \'Consultation Inquiry\' }}',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">We Received Your Request</h1>
    <p>Hi {{ $requestData->first_name }},</p>
    <p>Thank you for reaching out to Nissi Insights. We have received your inquiry and a member of our team will review it shortly.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Subject:</strong> {{ $requestData->subject ?? 'General Inquiry' }}</p>
        <p style="margin: 0;"><strong>Message:</strong> {{ $requestData->message }}</p>
    </div>

    <p>We aim to respond within 1-2 business days.</p>
    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['requestData'],
            ],
            [
                'key' => 'consultation_request_admin',
                'name' => 'Consultation Request - Admin Alert',
                'subject' => 'New Consultation Request: {{ $requestData->subject ?? \'General Inquiry\' }}',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">New Consultation Request</h1>
    <p>A new consultation request has been submitted.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Name:</strong> {{ $requestData->first_name }} {{ $requestData->last_name }}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> {{ $requestData->email }}</p>
        <p style="margin: 0 0 8px;"><strong>Subject:</strong> {{ $requestData->subject ?? '—' }}</p>
        <p style="margin: 0;"><strong>Message:</strong> {{ $requestData->message }}</p>
    </div>

    <p>
                    <a href="{{ frontend_url('/admin/requests') }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Requests</a>
    </p>
</div>
BLADE,
                'variables' => ['requestData'],
            ],

            // RSVP
            [
                'key' => 'rsvp_confirmation',
                'name' => 'RSVP Confirmation',
                'subject' => 'RSVP Received - Nissi Insights',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">RSVP Received</h1>
    <p>Hi {{ $rsvp->name }},</p>
    <p>Thank you for your RSVP. We have recorded your response and will be in touch with further details soon.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Name:</strong> {{ $rsvp->name }}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> {{ $rsvp->email }}</p>
        <p style="margin: 0 0 8px;"><strong>Company:</strong> {{ $rsvp->company ?? '—' }}</p>
        <p style="margin: 0 0 8px;"><strong>Job Title:</strong> {{ $rsvp->job_title ?? '—' }}</p>
        <p style="margin: 0;"><strong>Interest:</strong> {{ $rsvp->interest ?? '—' }}</p>
    </div>

    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['rsvp'],
            ],

            // Subscriber welcome
            [
                'key' => 'subscriber_welcome',
                'name' => 'Subscriber Welcome',
                'subject' => 'Welcome to Nissi Insights',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">Welcome</h1>
    <p>Hi {{ $subscriber->name ?? 'there' }},</p>
    <p>Thank you for subscribing to Nissi Insights. You will now receive our latest insights, event invitations, and market briefings.</p>

    <p>
        <a href="{{ frontend_url('/insights') }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Explore Insights</a>
    </p>

    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['subscriber'],
            ],

            // Content update notification
            [
                'key' => 'content_update_notification',
                'name' => 'Content Update Notification',
                'subject' => 'New {{ $typeLabel }}: {{ $title }} - Nissi Insights',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">New {{ $typeLabel }}</h1>
    <p>We have published a new {{ $typeLabel }} that may interest you.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>{{ $title }}</strong></p>
        <p style="margin: 0 0 8px;"><span style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">{{ $categoryLabel }}</span></p>
        <p style="margin: 0 0 12px;">{{ $excerpt }}</p>
        <p style="margin: 0;">
            <a href="{{ $url }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Read Now</a>
        </p>
    </div>

    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['typeLabel', 'categoryLabel', 'title', 'excerpt', 'url', 'imageUrl'],
            ],

            // Password reset
            [
                'key' => 'password_reset',
                'name' => 'Password Reset',
                'subject' => 'Reset Your Password - Nissi Insights',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">Reset Your Password</h1>
    <p>You requested a password reset for your Nissi Insights account.</p>

    <p>
        <a href="{{ $resetUrl }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
    </p>

    <p>This link will expire in {{ $expireCount }} minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['resetUrl', 'expireCount'],
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['key' => $template['key']],
                $template
            );
        }
    }
}
