import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  siteName?: string;
  author?: string;
  twitterCard?: string;
  twitterSite?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

const defaultMeta = {
  title: 'Little Star - Track Your Daughter\'s Journey with Love',
  description: 'The most gentle and secure way to track your little star\'s growth, health, activities, and precious memories. Designed by parents, for parents.',
  keywords: 'daughter tracking app, child development, growth tracking, parenting app, family memories, child health tracker, milestone tracker, baby tracker, toddler app, parenting tools',
  image: '/images/little-star-og-image.jpg',
  url: 'https://littlestar.app',
  type: 'website',
  locale: 'en_US',
  siteName: 'Little Star',
  author: 'Little Star Team',
  twitterCard: 'summary_large_image',
  twitterSite: '@LittleStarApp',
};

export function SEOMeta({
  title = defaultMeta.title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = defaultMeta.type,
  locale = defaultMeta.locale,
  siteName = defaultMeta.siteName,
  author = defaultMeta.author,
  twitterCard = defaultMeta.twitterCard,
  twitterSite = defaultMeta.twitterSite,
  canonicalUrl,
  noIndex = false,
}: SEOMetaProps) {
  const fullTitle = title === defaultMeta.title ? title : `${title} | ${siteName}`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;
  const fullUrl = canonicalUrl || url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Language */}
      <html lang="en" />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Theme Colors */}
      <meta name="theme-color" content="#E6E6FA" />
      <meta name="msapplication-TileColor" content="#E6E6FA" />
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": siteName,
          "description": description,
          "url": url,
          "image": fullImageUrl,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "applicationCategory": "Lifestyle",
          "operatingSystem": "iOS, Android, Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1247"
          },
          "featureList": [
            "Growth tracking",
            "Health monitoring",
            "Activity logging",
            "Memory preservation",
            "Milestone celebrations",
            "Secure data storage"
          ]
        })}
      </script>
      
      {/* Additional Schema for Parenting App */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": siteName,
          "description": description,
          "url": url,
          "applicationCategory": "ParentingApplication",
          "audience": {
            "@type": "Audience",
            "audienceType": "Parents"
          },
          "featureList": [
            "Child development tracking",
            "Health record keeping",
            "Photo and video storage",
            "Milestone reminders",
            "Growth chart visualization",
            "Privacy-first design"
          ],
          "inLanguage": "en-US",
          "isAccessibleForFree": true
        })}
      </script>
    </Helmet>
  );
}