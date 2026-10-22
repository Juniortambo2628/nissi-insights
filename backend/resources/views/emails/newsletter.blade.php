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
                        <td align="center" style="padding:20px 8px 8px; border-top:1px solid rgba(128,128,128,0.25); font-size:12px; line-height:1.7; color:#94a3b8;">
                            <p style="margin:0 0 4px; font-size:14px; font-weight:700; letter-spacing:0.16em; color:{{ $newsletter->text_color }};">NISSI <span style="color:{{ $newsletter->accent_color }};">|</span> INSIGHTS</p>
                            <p style="margin:0 0 12px; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#94a3b8;">Energy &middot; Fintech &middot; International Diplomacy</p>
                            <p style="margin:0 0 8px; font-size:13px; font-style:italic; color:{{ $newsletter->text_color }};">Navigating Complexity. Empowering Change.</p>
                            <p style="margin:0;">Nissi Insights Ltd &middot; 254742668529 G.P.O. Nairobi, Kenya</p>
                            <p style="margin:0 0 6px;">+254 717 128 838 &middot; +44 7838 725536</p>
                            <p style="margin:0 0 14px;">
                                <a href="{{ frontend_url() }}" style="color:{{ $newsletter->accent_color }}; text-decoration:none;">www.nissi-insights.com</a>
                            </p>
                            <p style="margin:0 0 8px; border-top:1px solid rgba(128,128,128,0.25); padding-top:12px; font-size:11px;">This brief is for general information and isn't legal advice.</p>
                            <p style="margin:0; font-size:11px;">
                                You're getting this because you signed up for updates from Nissi Insights.
                                @if($unsubscribeUrl)
                                <a href="{{ $unsubscribeUrl }}" style="color:{{ $newsletter->accent_color }}; text-decoration:underline;">Unsubscribe</a>
                                @endif
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
