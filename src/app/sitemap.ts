import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.couup.in';

  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/faqs',
    '/properties',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic listing routes
  try {
    await connectToDatabase();
    
    // Fetch only approved listings for the sitemap
    const listings = await Listing.find({ status: 'APPROVED' })
      .select('_id updatedAt createdAt')
      .lean();

    const listingRoutes = listings.map((listing: any) => ({
      url: `${baseUrl}/listings/${listing._id.toString()}`,
      lastModified: listing.updatedAt || listing.createdAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    return [...routes, ...listingRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static routes if DB fails
    return routes;
  }
}
