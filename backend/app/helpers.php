<?php

if (! function_exists('frontend_url')) {
    /**
     * Return the primary frontend URL.
     *
     * FRONTEND_URL may contain a comma-separated list for CORS, but many
     * places in the app need a single canonical URL (emails, redirects,
     * absolute asset URLs). This helper returns the first valid URL.
     */
    function frontend_url(?string $path = null): string
    {
        $raw = config('app.frontend_url', config('app.url', 'http://localhost'));
        $candidates = array_filter(array_map('trim', explode(',', $raw)));

        $url = 'http://localhost';
        foreach ($candidates as $candidate) {
            $candidate = rtrim($candidate, '/');
            if (filter_var($candidate, FILTER_VALIDATE_URL)) {
                $url = $candidate;
                break;
            }
        }

        if ($path === null) {
            return $url;
        }

        return $url . '/' . ltrim($path, '/');
    }
}
