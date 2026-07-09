<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>{{ $siteName ?? config('app.name', 'Nissi Insights') }}</title>
    <style>
        :root {
            color-scheme: light dark;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            color: #1e293b;
        }
        .email-wrapper {
            width: 100%;
            background-color: #f1f5f9;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
        }
        .header {
            padding: 32px 24px;
            text-align: center;
            background: #0f172a;
            border-bottom: 4px solid #2563eb;
        }
        .logo {
            max-height: 56px;
            width: auto;
            display: block;
            margin: 0 auto;
        }
        .logo-box {
            display: inline-block;
            background: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
        }
        .logo-fallback {
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: -0.02em;
        }
        .content {
            padding: 40px 32px;
            line-height: 1.7;
            color: #334155;
            background-color: #ffffff;
        }
        .content h1, .content h2, .content h3 {
            color: #0f172a;
            margin-top: 0;
            font-weight: 700;
        }
        .content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content p {
            margin: 0 0 16px;
        }
        .content strong {
            color: #0f172a;
        }
        .event-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            margin: 24px 0;
        }
        .event-image {
            width: 100%;
            height: auto;
            display: block;
            max-height: 240px;
            object-fit: cover;
            border: 0;
        }
        .event-details {
            padding: 20px;
        }
        .detail-row {
            margin-bottom: 8px;
            color: #475569;
        }
        .detail-row strong {
            color: #0f172a;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 16px 0;
        }
        .footer {
            padding: 28px 24px;
            text-align: center;
            font-size: 13px;
            color: #94a3b8;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 0 0 8px;
        }
        .footer a {
            color: #64748b;
            text-decoration: none;
            margin: 0 8px;
        }
        .social {
            margin-top: 16px;
        }
        .social a {
            display: inline-block;
            margin: 0 6px;
        }

        @media (prefers-color-scheme: dark) {
            body, .email-wrapper {
                background-color: #0f172a !important;
            }
            .container {
                background-color: #1e293b !important;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;
            }
            .content {
                background-color: #1e293b !important;
                color: #cbd5e1 !important;
            }
            .content h1, .content h2, .content h3, .content strong, .detail-row strong {
                color: #f8fafc !important;
            }
            .event-card {
                background: #334155 !important;
                border-color: #475569 !important;
            }
            .detail-row {
                color: #cbd5e1 !important;
            }
            .footer {
                background-color: #0f172a !important;
                border-top-color: #334155 !important;
                color: #94a3b8 !important;
            }
            .footer a {
                color: #cbd5e1 !important;
            }
        }
    </style>
</head>
<body>
    @php
        $siteName = \App\Models\SiteSetting::getValue('site_name', config('app.name', 'Nissi Insights'));
        $frontendUrl = frontend_url();

        // Resolve logo URLs. Dark logo is preferred for the dark header.
        $resolveLogo = function (?string $raw) use ($frontendUrl): ?string {
            if (empty($raw)) {
                return null;
            }
            $candidates = array_filter(array_map('trim', explode(',', $raw)));
            foreach ($candidates as $candidate) {
                $candidate = str_replace(['http//', 'https//'], ['http://', 'https://'], $candidate);
                if (filter_var($candidate, FILTER_VALIDATE_URL)) {
                    return $candidate;
                }
                if (str_starts_with($candidate, '/')) {
                    return $frontendUrl . $candidate;
                }
                // Storage paths or relative asset paths
                if (str_starts_with($candidate, 'storage/') || str_starts_with($candidate, 'assets/')) {
                    return $frontendUrl . '/' . $candidate;
                }
            }
            return null;
        };

        $darkLogoUrl = $resolveLogo(\App\Models\SiteSetting::getValue('logo_dark'));
        $lightLogoUrl = $resolveLogo(\App\Models\SiteSetting::getValue('logo_light'));
        $logoUrl = $darkLogoUrl ?: $lightLogoUrl;

        $addresses = json_decode(\App\Models\SiteSetting::getValue('business_addresses', '[]'), true) ?: [];
        $primaryAddress = $addresses[0]['address'] ?? '';
        $primaryPhone = $addresses[0]['phone'] ?? '';
    @endphp
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                @if($logoUrl)
                    @if($darkLogoUrl)
                        <img src="{{ $darkLogoUrl }}" alt="{{ $siteName }}" class="logo" width="240" height="56" border="0" style="display:block;max-height:56px;width:auto;">
                    @else
                        <div class="logo-box">
                            <img src="{{ $lightLogoUrl }}" alt="{{ $siteName }}" class="logo" width="240" height="56" border="0" style="display:block;max-height:56px;width:auto;">
                        </div>
                    @endif
                @else
                    <a href="{{ $frontendUrl }}" class="logo-fallback">{{ $siteName }}</a>
                @endif
            </div>
            <div class="content">
                @if(isset($content))
                    {!! $content !!}
                @else
                    @yield('content')
                @endif
            </div>
            <div class="footer">
                <p>&copy; {{ date('Y') }} {{ $siteName }}. All rights reserved.</p>
                @if($primaryAddress)
                    <p>{{ $primaryAddress }}</p>
                @endif
                @if($primaryPhone)
                    <p>{{ $primaryPhone }}</p>
                @endif
                <div style="margin-top: 16px;">
                    <a href="{{ $frontendUrl }}">Website</a>
                    <span style="color: #cbd5e1;">|</span>
                    <a href="{{ $frontendUrl . '/privacy' }}">Privacy Policy</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
