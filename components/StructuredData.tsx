/**
 * 🔍 Structured Data Component
 *
 * Adds JSON-LD structured data for SEO and rich snippets.
 * Helps search engines understand horoscope content.
 */

interface StructuredDataProps {
  horoscope?: {
    sign: string;
    period: string;
    text: string;
    date: string;
  };
}

export function StructuredData({ horoscope }: StructuredDataProps) {
  // Base organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Cosmic Horoscope",
    "url": "https://cosmic-horoscope.deno.dev",
    "description": "Get your daily, weekly, or monthly horoscope styled as shareable cosmic art.",
    "applicationCategory": "LifestyleApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "Pablo Alvarado",
      "url": "https://pibul.us"
    }
  };

  // If horoscope data is provided, add Article schema
  const horoscopeSchema = horoscope ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${horoscope.sign.charAt(0).toUpperCase() + horoscope.sign.slice(1)} ${horoscope.period} Horoscope`,
    "description": horoscope.text.substring(0, 200),
    "datePublished": horoscope.date,
    "author": {
      "@type": "Organization",
      "name": "Cosmic Horoscope"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cosmic Horoscope",
      "url": "https://cosmic-horoscope.deno.dev"
    }
  } : null;

  // Combine schemas
  const structuredData = horoscopeSchema
    ? [organizationSchema, horoscopeSchema]
    : organizationSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
