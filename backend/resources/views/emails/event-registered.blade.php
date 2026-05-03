<x-mail::message>
# Registration Confirmed

Hi {{ $name }},

You have successfully registered for **{{ $eventTitle }}**.

**Event Details:**
- **Date:** {{ $eventDate }}
- **Location:** {{ $eventLocation }}

We look forward to seeing you there!

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
