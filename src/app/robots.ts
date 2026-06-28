import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/host/'],
    },
    sitemap: 'https://www.couup.in/sitemap.xml',
  };
}
