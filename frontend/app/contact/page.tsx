import React from 'react'
import ContactClient from './ContactClient'

export const metadata = {
    title: 'Contact Us | Nissi Insights | Get in Touch for Advisory Services',
    description: 'Get in touch with Nissi Insights. Contact our energy transition, fintech, and sovereign intelligence experts to request a consultation.',
    keywords: [
        'Contact Nissi Insights',
        'Energy Advisory Consultation',
        'Fintech Strategy Consultation',
        'Nissi Insights phone number',
        'Nissi Insights email',
        'Request advisory consultation'
    ],
    openGraph: {
        title: 'Contact Us | Nissi Insights | Get in Touch for Advisory Services',
        description: 'Get in touch with Nissi Insights. Contact our energy transition, fintech, and sovereign intelligence experts to request a consultation.',
        type: 'website',
        url: 'https://nissi-insights.com/contact',
    }
}

export default function ContactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": "https://nissi-insights.com/contact/#webpage",
                "url": "https://nissi-insights.com/contact",
                "name": "Contact Us | Nissi Insights",
                "description": "Contact Nissi Insights for strategic advisory, market intelligence, or sovereign engagement.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://nissi-insights.com/#website",
                    "url": "https://nissi-insights.com",
                    "name": "Nissi Insights"
                }
            },
            {
                "@type": "ProfessionalService",
                "@id": "https://nissi-insights.com/#organization",
                "name": "Nissi Insights",
                "url": "https://nissi-insights.com",
                "logo": "https://nissi-insights.com/favicon.png",
                "telephone": "+44 (0) 20 7123 4567",
                "email": "advisory@nissi-insights.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Level 32, One Canada Square, Canary Wharf",
                    "addressLocality": "London",
                    "postalCode": "E14 5AB",
                    "addressCountry": "GB"
                }
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactClient />
        </>
    )
}
