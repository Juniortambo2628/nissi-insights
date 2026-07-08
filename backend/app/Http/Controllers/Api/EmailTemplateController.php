<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\TemplatedMail;
use App\Models\EmailLog;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Mail;

class EmailTemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = EmailTemplate::query();

        if ($request->has('key')) {
            $query->where('key', $request->key);
        }

        if ($request->boolean('active_only')) {
            $query->active();
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:email_templates,key',
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'variables.*' => 'string',
            'is_active' => 'boolean',
        ]);

        $template = EmailTemplate::create($validated);

        return response()->json($template, 201);
    }

    public function show(EmailTemplate $emailTemplate)
    {
        return response()->json($emailTemplate);
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'variables' => 'nullable|array',
            'variables.*' => 'string',
            'is_active' => 'boolean',
        ]);

        $emailTemplate->update($validated);

        return response()->json($emailTemplate);
    }

    public function destroy(EmailTemplate $emailTemplate)
    {
        $emailTemplate->delete();

        return response()->json(null, 204);
    }

    public function preview(Request $request)
    {
        $request->validate([
            'template_key' => 'required_without:template_id|string',
            'template_id' => 'required_without:template_key|integer|exists:email_templates,id',
            'content' => 'nullable|string',
            'subject' => 'nullable|string',
        ]);

        $dummyData = $this->dummyData();

        try {
            $body = $request->input('content');
            $subject = $request->input('subject', 'Preview Subject');

            if (!$body && $request->has('template_id')) {
                $template = EmailTemplate::findOrFail($request->template_id);
                $body = $template->body;
                $subject = $template->subject;
            } elseif (!$body && $request->has('template_key')) {
                $template = EmailTemplate::byKey($request->template_key)->firstOrFail();
                $body = $template->body;
                $subject = $template->subject;
            }

            $renderedSubject = Blade::render($subject, $dummyData);
            $renderedBody = $this->wrapInLayout(Blade::render($body, $dummyData));

            return response()->json([
                'html' => $renderedBody,
                'subject' => $renderedSubject,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Template Error: ' . $e->getMessage()], 422);
        }
    }

    public function health()
    {
        $mailer = config('mail.default');
        $fromAddress = config('mail.from.address');
        $adminAddress = config('mail.admin_address');

        return response()->json([
            'mailer' => $mailer,
            'from_address' => $fromAddress,
            'admin_address' => $adminAddress,
            'is_log_driver' => $mailer === 'log',
            'warning' => $mailer === 'log' ? 'MAIL_MAILER is set to log; no real emails are being delivered.' : null,
        ]);
    }

    public function sendTest(Request $request)
    {
        $request->validate([
            'template_id' => 'required|integer|exists:email_templates,id',
            'to' => 'required|email',
        ]);

        $template = EmailTemplate::findOrFail($request->template_id);
        $recipient = $request->input('to');

        try {
            $mail = new TemplatedMail($template->key, $this->dummyData());
            Mail::to($recipient)->send($mail);
            $mail->log($recipient, 'sent');

            return response()->json(['message' => 'Test email sent to ' . $recipient]);
        } catch (\Exception $e) {
            \Log::error('Failed to send test email: ' . $e->getMessage());

            return response()->json(['error' => 'Failed to send test email: ' . $e->getMessage()], 422);
        }
    }

    protected function dummyData(): array
    {
        return [
            'name' => 'Alexander Hamilton',
            'first_name' => 'Alexander',
            'last_name' => 'Hamilton',
            'email' => 'a.hamilton@treasury.gov',
            'phone' => '+1 (555) 123-4567',
            'organization' => 'The Treasury',
            'subject' => 'Strategic Advisory Inquiry',
            'message' => 'This is a sample message to demonstrate how your email template will look with actual data.',
            'status' => 'pending',
            'eventTitle' => 'Annual Energy Outlook 2026',
            'eventDate' => now()->addWeek()->format('F j, Y'),
            'eventTime' => now()->addWeek()->format('g:i a T'),
            'eventLocation' => 'One Canada Square, London',
            'eventLink' => config('app.frontend_url') . '/events/sample-event',
            'eventId' => 1,
        ];
    }

    protected function wrapInLayout(string $body): string
    {
        if (str_contains($body, '<html')) {
            return $body;
        }

        return view('emails.layout', ['content' => $body])->render();
    }
}
