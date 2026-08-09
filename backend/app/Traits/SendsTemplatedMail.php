<?php

namespace App\Traits;

use App\Mail\TemplatedMail;
use Illuminate\Support\Facades\Mail;

trait SendsTemplatedMail
{
    protected function sendTemplatedMail(string $templateKey, string $recipient, array $data, ?object $sendable = null): bool
    {
        try {
            $mail = new TemplatedMail($templateKey, $data, $sendable);
            Mail::to($recipient)->send($mail);
            $mail->log($recipient, 'sent');

            return true;
        } catch (\Exception $e) {
            \Log::error("Failed to send {$templateKey} to {$recipient}: ".$e->getMessage());
            (new TemplatedMail($templateKey, $data, $sendable))
                ->log($recipient, 'failed', $e->getMessage());

            return false;
        }
    }
}
