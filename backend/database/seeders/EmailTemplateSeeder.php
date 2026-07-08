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
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">Registration Confirmed</h1>
    <p>Hi {{ $name }},</p>
    <p>You have successfully registered for <strong>{{ $eventTitle }}</strong>.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Date:</strong> {{ $eventDate }}</p>
        <p style="margin: 0 0 8px;"><strong>Time:</strong> {{ $eventTime }}</p>
        <p style="margin: 0;"><strong>Location:</strong> {{ $eventLocation }}</p>
    </div>

    @if($eventLink)
    <p>
        <a href="{{ $eventLink }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Event</a>
    </p>
    @endif

    <p>We look forward to seeing you there!</p>
    <p>Thanks,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventDate', 'eventTime', 'eventLocation', 'eventLink'],
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
        <a href="{{ config('app.frontend_url') }}/admin/registrations?event_id={{ $eventId }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Registrations</a>
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
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">Starting Soon</h1>
    <p>Hi {{ $name }},</p>
    <p>This is a friendly reminder that <strong>{{ $eventTitle }}</strong> is starting soon.</p>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Date:</strong> {{ $eventDate }}</p>
        <p style="margin: 0 0 8px;"><strong>Time:</strong> {{ $eventTime }}</p>
        <p style="margin: 0;"><strong>Location:</strong> {{ $eventLocation }}</p>
    </div>

    @if($eventLink)
    <p>
        <a href="{{ $eventLink }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Event</a>
    </p>
    @endif

    <p>See you there!</p>
</div>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventDate', 'eventTime', 'eventLocation', 'eventLink'],
            ],
            [
                'key' => 'event_reminder_started',
                'name' => 'Event Reminder - Started',
                'subject' => 'Live Now: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">We're Live</h1>
    <p>Hi {{ $name }},</p>
    <p><strong>{{ $eventTitle }}</strong> is starting right now.</p>

    @if($eventLink)
    <p>
        <a href="{{ $eventLink }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Now</a>
    </p>
    @else
    <p>Please check your calendar for the joining details.</p>
    @endif

    <p>See you inside!</p>
</div>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventLink'],
            ],
            [
                'key' => 'event_thank_you_ended',
                'name' => 'Event Thank You - Ended',
                'subject' => 'Thank You for Attending: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">Thank You for Attending</h1>
    <p>Hi {{ $name }},</p>
    <p>Thank you for joining us at <strong>{{ $eventTitle }}</strong>. We hope you found the session insightful and valuable.</p>

    @if($eventLink)
    <p>
        <a href="{{ $eventLink }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Resources</a>
    </p>
    @endif

    <p>If you have any further questions or would like to discuss our services, feel free to reach out.</p>
    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventLink'],
            ],
            [
                'key' => 'event_attended_thank_you',
                'name' => 'Event Attendance - Manual Thank You',
                'subject' => 'Thank You for Attending: {{ $eventTitle }}',
                'body' => <<<'BLADE'
<div style="max-width: 600px; margin: 0 auto; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #334155;">
    <h1 style="color: #0f172a; margin-top: 0;">Thank You for Attending</h1>
    <p>Hi {{ $name }},</p>
    <p>Thank you for attending <strong>{{ $eventTitle }}</strong>. It was a pleasure having you with us.</p>

    @if($eventLink)
    <p>
        <a href="{{ $eventLink }}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Resources</a>
    </p>
    @endif

    <p>We hope to see you at future events.</p>
    <p>Best regards,<br>{{ config('app.name') }}</p>
</div>
BLADE,
                'variables' => ['name', 'eventTitle', 'eventLink'],
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
