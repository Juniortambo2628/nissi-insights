<?php

/*
|--------------------------------------------------------------------------
| Bulk mail safeguards
|--------------------------------------------------------------------------
|
| Newsletter campaigns and content broadcasts send one email per recipient.
| On shared hosting every one of those goes through the domain's mailbox, and
| an unthrottled burst gets the mailbox suspended for spam. These settings
| keep bulk sending inside the host's limits and let it be switched off or
| moved to a dedicated email provider without a code change.
|
*/

return [

    // Master switch for every bulk send (campaigns and broadcasts).
    // Transactional mail (contact form receipts, RSVPs, password resets)
    // is not affected. Off unless explicitly enabled.
    'enabled' => (bool) env('BULK_MAIL_ENABLED', false),

    // Mailer used for bulk sends. Leave empty to use the default mailer.
    // Point this at a dedicated provider (e.g. a second SMTP mailer for an
    // email marketing service) so bulk mail never goes through the hosting
    // mailbox.
    'mailer' => env('BULK_MAIL_MAILER') ?: null,

    // Rolling caps on bulk messages actually sent, across all bulk sends.
    'hourly_limit' => (int) env('BULK_MAIL_HOURLY_LIMIT', 50),
    'daily_limit' => (int) env('BULK_MAIL_DAILY_LIMIT', 200),

    // Most messages a single send request may deliver. Campaigns with more
    // eligible recipients are sent in batches and can be resumed later.
    'per_send_limit' => (int) env('BULK_MAIL_PER_SEND_LIMIT', 20),

    // Pause between messages, in milliseconds, so a batch is spread out
    // instead of hitting the mail server in one burst.
    'delay_ms' => (int) env('BULK_MAIL_DELAY_MS', 1000),

    // EmailLog template keys counted as bulk mail for the caps above.
    'template_keys' => ['newsletter', 'content_update_notification'],

];
