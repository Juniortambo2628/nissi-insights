<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaseStudyController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ConsultationRequestController;
use App\Http\Controllers\Api\EmailLogController;
use App\Http\Controllers\Api\EmailTemplateController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventRegistrationController;
use App\Http\Controllers\Api\InsightController;
use App\Http\Controllers\Api\PillarController;
use App\Http\Controllers\Api\RedirectController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\StatController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\ValueController;
use App\Http\Controllers\RsvpController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/rsvps', [RsvpController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{slug}', [EventController::class, 'show']);
Route::post('/events/register', [EventRegistrationController::class, 'store']);
Route::get('/stocks', [StockController::class, 'index']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service:slug}', [ServiceController::class, 'show']);

Route::get('/insights', [InsightController::class, 'index']);
Route::get('/insights/{insight:slug}', [InsightController::class, 'show']);

Route::get('/case-studies', [CaseStudyController::class, 'index']);
Route::get('/case-studies/{caseStudy:slug}', [CaseStudyController::class, 'show']);

Route::get('/stats', [StatController::class, 'index']);
Route::get('/settings', [SiteSettingController::class, 'index']);
Route::get('/settings/launch', [SiteSettingController::class, 'getLaunchSettings']);

Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/clients', [ClientController::class, 'index']);
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::get('/values', [ValueController::class, 'index']);

// Pillars public
Route::get('/pillars', [PillarController::class, 'index']);
Route::get('/pillars/{slug}', [PillarController::class, 'show']);

// Knowledge Base public
Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{slug}', [ResourceController::class, 'show']);

// Public — search, tracking, newsletter, redirects
Route::get('/search', [SearchController::class, 'index']);
Route::post('/track', [AnalyticsController::class, 'track']);
Route::post('/track-404', [AnalyticsController::class, 'track404']);
Route::post('/subscribe', [SubscriberController::class, 'store']);
Route::post('/consultation-requests', [ConsultationRequestController::class, 'store']);
Route::get('/storage/{path}', [UploadController::class, 'serve'])->where('path', '.*');
Route::get('/redirects-public', [RedirectController::class, 'publicList']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Rsvps
    Route::get('/rsvps', [RsvpController::class, 'index']);
    Route::put('/rsvps/{rsvp}', [RsvpController::class, 'update']);
    Route::delete('/rsvps/{rsvp}', [RsvpController::class, 'destroy']);

    // Services CRUD
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // Insights CRUD
    Route::post('/insights', [InsightController::class, 'store']);
    Route::put('/insights/{insight}', [InsightController::class, 'update']);
    Route::delete('/insights/{insight}', [InsightController::class, 'destroy']);

    // Case Studies CRUD
    Route::post('/case-studies', [CaseStudyController::class, 'store']);
    Route::put('/case-studies/{caseStudy}', [CaseStudyController::class, 'update']);
    Route::delete('/case-studies/{caseStudy}', [CaseStudyController::class, 'destroy']);

    // Stats CRUD
    Route::post('/stats', [StatController::class, 'store']);
    Route::put('/stats/{stat}', [StatController::class, 'update']);
    Route::delete('/stats/{stat}', [StatController::class, 'destroy']);

    // Settings
    Route::put('/settings/batch', [SiteSettingController::class, 'batchUpdate']);
    Route::put('/settings/{siteSetting}', [SiteSettingController::class, 'update']);

    // Testimonials CRUD
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    // Clients CRUD
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put('/clients/{client}', [ClientController::class, 'update']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

    // File Upload
    Route::post('/upload', [UploadController::class, 'store']);
    Route::delete('/upload', [UploadController::class, 'destroy']);

    // Analytics (admin)
    Route::get('/analytics/summary', [AnalyticsController::class, 'summary']);
    Route::get('/analytics/events', [AnalyticsController::class, 'eventAnalytics']);
    Route::get('/analytics/not-found-logs', [AnalyticsController::class, 'notFoundLogs']);
    Route::get('/analytics/not-found-summary', [AnalyticsController::class, 'notFoundSummary']);

    // Redirects (admin)
    Route::apiResource('redirects', RedirectController::class);

    // Subscribers (admin)
    Route::get('/subscribers', [SubscriberController::class, 'index']);
    Route::delete('/subscribers/{subscriber}', [SubscriberController::class, 'destroy']);

    // Team Members
    Route::post('/team-members', [TeamMemberController::class, 'store']);
    Route::put('/team-members/{teamMember}', [TeamMemberController::class, 'update']);
    Route::delete('/team-members/{teamMember}', [TeamMemberController::class, 'destroy']);

    // Values
    Route::post('/values', [ValueController::class, 'store']);
    Route::put('/values/{value}', [ValueController::class, 'update']);
    Route::delete('/values/{value}', [ValueController::class, 'destroy']);

    // Pillars CRUD
    Route::post('/pillars', [PillarController::class, 'store']);
    Route::put('/pillars/{pillar}', [PillarController::class, 'update']);
    Route::delete('/pillars/{pillar}', [PillarController::class, 'destroy']);

    // Knowledge Base (Resources) CRUD
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::put('/resources/{resource}', [ResourceController::class, 'update']);
    Route::delete('/resources/{resource}', [ResourceController::class, 'destroy']);

    // Consultation Requests
    Route::get('/consultation-requests', [ConsultationRequestController::class, 'index']);
    Route::put('/consultation-requests/{consultationRequest}', [ConsultationRequestController::class, 'update']);
    Route::delete('/consultation-requests/{consultationRequest}', [ConsultationRequestController::class, 'destroy']);

    // Events CRUD
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Event Registrations
    Route::get('/event-registrations', [EventRegistrationController::class, 'index']);
    Route::put('/event-registrations/{eventRegistration}', [EventRegistrationController::class, 'update']);
    Route::delete('/event-registrations/{eventRegistration}', [EventRegistrationController::class, 'destroy']);

    // Email Templates
    Route::get('/email-templates/health', [EmailTemplateController::class, 'health']);
    Route::get('/email-templates', [EmailTemplateController::class, 'index']);
    Route::post('/email-templates', [EmailTemplateController::class, 'store']);
    Route::get('/email-templates/{emailTemplate}', [EmailTemplateController::class, 'show']);
    Route::put('/email-templates/{emailTemplate}', [EmailTemplateController::class, 'update']);
    Route::delete('/email-templates/{emailTemplate}', [EmailTemplateController::class, 'destroy']);
    Route::post('/email-templates/preview', [EmailTemplateController::class, 'preview']);
    Route::post('/email-templates/send-test', [EmailTemplateController::class, 'sendTest']);

    // Email Logs
    Route::get('/email-logs', [EmailLogController::class, 'index']);
    Route::get('/email-logs/summary', [EmailLogController::class, 'summary']);
});
