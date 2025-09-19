import { useTranslation } from 'react-i18next'

// Base site configuration
const SITE_CONFIG = {
  name: {
    ar: 'قدومي للإلكترونيات والأجهزة الكهربائية',
    en: 'Qaddumi Electronics & Appliances'
  },
  description: {
    ar: 'أحدث الأجهزة الكهربائية بأفضل الأسعار في طولكرم، فلسطين. ثلاجات، غسالات، مكيفات، وأكثر مع خدمة التوصيل والتركيب.',
    en: 'Latest electrical appliances at the best prices in Tulkarm, Palestine. Refrigerators, washing machines, air conditioners, and more with delivery and installation service.'
  },
  url: 'https://qaddumi.ps',
  logo: '/images/logo.svg',
  image: '/images/og-image.jpg',
  twitterHandle: '@qaddumi_ps',
  facebookPage: 'qaddumi.electronics',
}

// Generate SEO meta tags
export const generateSEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  locale = 'ar',
  alternateLocales = ['en'],
  noindex = false,
  nofollow = false,
  canonicalUrl,
}) => {
  const siteName = SITE_CONFIG.name[locale]
  const siteDescription = SITE_CONFIG.description[locale]
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const fullDescription = description || siteDescription
  const fullImage = image ? `${SITE_CONFIG.url}${image}` : `${SITE_CONFIG.url}${SITE_CONFIG.image}`
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ')

  return {
    title: fullTitle,
    meta: [
      { name: 'description', content: fullDescription },
      { name: 'robots', content: robotsContent },
      
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: fullDescription },
      { property: 'og:image', content: fullImage },
      { property: 'og:url', content: fullUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: locale === 'ar' ? 'ar_PS' : 'en_US' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: SITE_CONFIG.twitterHandle },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: fullDescription },
      { name: 'twitter:image', content: fullImage },
      
      // Additional meta
      { name: 'theme-color', content: '#E5C779' },
      { name: 'msapplication-TileColor', content: '#E5C779' },
    ],
    link: [
      ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : []),
      ...alternateLocales.map(altLocale => ({
        rel: 'alternate',
        hreflang: altLocale,
        href: `${SITE_CONFIG.url}/${altLocale}${url || ''}`
      })),
      // Preconnect to external resources
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: true },
    ]
  }
}

// Generate product-specific SEO
export const generateProductSEO = (product, locale = 'ar') => {
  const name = product[`name_${locale}`]
  const description = product[`short_desc_${locale}`] || product[`long_desc_${locale}`]
  const brand = product.brands?.[`name_${locale}`] || product.brand?.[`name_${locale}`]
  const category = product.categories?.[`name_${locale}`] || product.category?.[`name_${locale}`]
  const price = product.sale_price || product.price
  const currency = product.currency || 'ILS'
  const image = product.media?.find(m => m.is_primary)?.url || product.media?.[0]?.url
  
  const title = brand ? `${name} - ${brand}` : name
  const fullDescription = `${description} | السعر: ${price} ${currency} | ${category} | توصيل وتركيب في طولكرم`

  return {
    ...generateSEO({
      title,
      description: fullDescription,
      image,
      url: `/${locale}/p/${product.slug}`,
      type: 'product',
      locale,
    }),
    structuredData: generateProductStructuredData(product, locale),
  }
}

// Generate category-specific SEO
export const generateCategorySEO = (category, locale = 'ar') => {
  const name = category[`name_${locale}`]
  const description = category[`description_${locale}`]
  
  const title = `${name} - أجهزة كهربائية`
  const fullDescription = description || `تسوق أفضل ${name} بأسعار مميزة في طولكرم. توصيل سريع وتركيب احترافي.`

  return generateSEO({
    title,
    description: fullDescription,
    image: category.image_url,
    url: `/${locale}/c/${category.slug}`,
    type: 'website',
    locale,
  })
}

// Generate structured data for products
export const generateProductStructuredData = (product, locale = 'ar') => {
  const name = product[`name_${locale}`]
  const description = product[`short_desc_${locale}`] || product[`long_desc_${locale}`]
  const brand = product.brands?.[`name_${locale}`] || product.brand?.[`name_${locale}`]
  const category = product.categories?.[`name_${locale}`] || product.category?.[`name_${locale}`]
  const price = product.sale_price || product.price
  const originalPrice = product.price
  const currency = product.currency || 'ILS'
  const image = product.media?.find(m => m.is_primary)?.url || product.media?.[0]?.url
  const availability = product.stock_qty > 0 ? 'InStock' : 'OutOfStock'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    category,
    image: image ? `${SITE_CONFIG.url}${image}` : undefined,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      ...(product.sale_price && originalPrice > product.sale_price ? {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } : {}),
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count || 1,
    } : undefined,
    warranty: product.warranty_months ? {
      '@type': 'WarrantyPromise',
      durationOfWarranty: `P${product.warranty_months}M`,
    } : undefined,
  }
}

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_CONFIG.url}${crumb.url}`,
    })),
  }
}

// Generate organization structured data
export const generateOrganizationStructuredData = (locale = 'ar') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name[locale],
    description: SITE_CONFIG.description[locale],
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.image}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'طولكرم',
      addressLocality: 'طولكرم',
      addressRegion: 'فلسطين',
      addressCountry: 'PS',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.3078,
      longitude: 35.0278,
    },
    telephone: '+970-9-234-5678',
    email: 'info@qaddumi.ps',
    openingHours: [
      'Mo-Th 09:00-21:00',
      'Sa 09:00-21:00',
      'Su 09:00-21:00',
      'Fr 14:00-21:00',
    ],
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'ILS',
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 150,
    },
  }
}

// Hook for easy SEO usage in components
export const useSEO = () => {
  const { i18n } = useTranslation()

  return {
    generateSEO: (config) => generateSEO({ ...config, locale: i18n.language }),
    generateProductSEO: (product) => generateProductSEO(product, i18n.language),
    generateCategorySEO: (category) => generateCategorySEO(category, i18n.language),
    siteConfig: SITE_CONFIG,
  }
}
