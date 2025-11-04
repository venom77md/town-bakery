/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://town-bakery.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://town-bakery.vercel.app/sitemap.xml',
    ],
  },
  alternateRefs: [
    {
      href: 'https://town-bakery.vercel.app',
      hreflang: 'ar',
    },
  ],
};

