import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '../utils/blogData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://brokeragecompass.com';
  const currentDate = new Date().toISOString();
  
  // Get all blog posts
  const blogPosts = getAllBlogPosts();
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];
  
  // Blog post pages
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/resources/${post.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  return [...staticPages, ...blogPages];
}
