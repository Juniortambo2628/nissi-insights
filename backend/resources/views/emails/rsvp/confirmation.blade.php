<x-mail::message>
# <div style="text-align: center;"><img src="{{ $logoUrl }}" alt="Nissi Insights Logo" style="height: 60px; margin-bottom: 20px;"></div>

# Access Requested Successfully

Hi {{ $rsvp->name }},

Thank you for your interest in the Nissi Insights platform.

You have successfully been added to our exclusive early access list! Our team is currently preparing a revolutionary market intelligence platform designed around your needs. 

We will notify you the moment the platform goes live so you can begin exploring our data and insights.

<x-mail::panel>
**Your Information Logged:**
- **Email:** {{ $rsvp->email }}
@if($rsvp->company)
- **Organization:** {{ $rsvp->company }}
@endif
@if($rsvp->job_title)
- **Position:** {{ $rsvp->job_title }}
@endif
@if($rsvp->sector)
- **Sector:** {{ $rsvp->sector }}
@endif
@if($rsvp->interest)
- **Interest:** {{ $rsvp->interest }}
@endif
</x-mail::panel>

If you have any immediate questions, feel free to reply directly to this email.

Best regards,<br>
The Nissi Insights Team
</x-mail::message>
