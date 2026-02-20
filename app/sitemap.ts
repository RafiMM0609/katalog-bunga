import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kagitacraft.com'
  
  // Static pages
  const staticPages = [
    '',
    '/katalog',
    '/tentang-kami',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Product pages (mock data - replace with database query)
  const productIds = [1, 2, 3, 4, 5, 6, 7, 8]
  const productPages = productIds.map((id) => ({
    url: `${baseUrl}/produk/${id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages]
}
