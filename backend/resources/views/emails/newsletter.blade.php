<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>{{ $newsletter->title }}</title>
    @if($newsletter->preheader)
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">{{ $newsletter->preheader }}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
    @endif
</head>
<body style="margin:0; padding:0; background-color:{{ $newsletter->background_color }}; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{{ $newsletter->background_color }};">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">
                    @if($headerImageUrl)
                    <tr>
                        <td style="padding:0 0 24px;">
                            <a href="{{ frontend_url() }}" style="text-decoration:none;">
                                <img src="{{ $headerImageUrl }}" alt="{{ $newsletter->title }}" width="600" style="display:block; width:100%; height:auto; border:0; border-radius:8px;">
                            </a>
                        </td>
                    </tr>
                    @endif
                    <tr>
                        <td style="padding:8px 8px 24px;">
                            <h1 style="margin:0; font-size:28px; line-height:1.3; font-weight:700; color:{{ $newsletter->text_color }};">{{ $newsletter->title }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="nl-content" style="padding:0 8px 32px; font-size:16px; line-height:1.7; color:{{ $newsletter->text_color }};">
                            {!! $contentHtml !!}
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:16px 8px 8px; border-top:1px solid rgba(128,128,128,0.25); font-size:12px; line-height:1.6; color:#94a3b8;">
                            <p style="margin:0 0 8px;">&copy; {{ date('Y') }} {{ \App\Models\SiteSetting::getValue('site_name', config('app.name', 'Nissi Insights')) }}. All rights reserved.</p>
                            @if($unsubscribeUrl)
                            <p style="margin:0 0 8px;">
                                You are receiving this email because you are on our mailing list.<br>
                                <a href="{{ $unsubscribeUrl }}" style="color:{{ $newsletter->accent_color }}; text-decoration:underline;">Unsubscribe from this list</a>
                            </p>
                            @endif
                            <p style="margin:0;">
                                <a href="{{ frontend_url() }}" style="color:#94a3b8; text-decoration:none; margin:0 6px;">Website</a>
                                <span style="color:#cbd5e1;">|</span>
                                <a href="{{ frontend_url('/privacy') }}" style="color:#94a3b8; text-decoration:none; margin:0 6px;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
