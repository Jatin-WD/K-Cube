import type { MetadataRoute } from 'next';

const siteUrl = 'https://k-cube.store';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/about',
    '/activities',
    '/events',
    '/events/korean-language-culture-class',
    '/learning',
    '/kfood',
    '/rewards',
    '/shop',
    '/trip-to-korea',
    '/study-abroad',
    '/india-pre-selection',
    '/india-pre-selection/information',
    '/india-pre-selection/announcement',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === '/events/korean-language-culture-class' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : route === '/events/korean-language-culture-class' ? 0.9 : 0.6,
  }));
}
