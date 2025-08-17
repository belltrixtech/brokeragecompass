'use client';

import Link from 'next/link';
import { FadeInUp, StaggerContainer, StaggerItem } from '../../components/Animations';

export default function ResourcesPage() {
  const blogPosts = [
    {
      slug: 'how-to-compare-real-estate-brokerages',
      title: 'How to Compare Real Estate Brokerages: Complete 2025 Guide',
      excerpt: 'Learn the key factors to evaluate when choosing a brokerage, from commission splits to support systems.',
      category: 'Guides',
      readTime: '8 min read',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      slug: 'understanding-revenue-share-programs',
      title: 'Understanding Revenue Share Programs: Build Passive Income',
      excerpt: 'Discover how revenue share works and why it could be a game-changer for your real estate career.',
      category: 'Education',
      readTime: '6 min read', 
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      slug: 'cloud-vs-traditional-brokerages',
      title: 'Cloud vs Traditional Brokerages: Which is Right for You?',
      excerpt: 'Compare the pros and cons of modern cloud brokerages versus traditional franchise models.',
      category: 'Comparison',
      readTime: '10 min read',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    {
      slug: 'commission-splits-explained',
      title: 'Real Estate Commission Splits Explained: Maximize Your Earnings',
      excerpt: 'Break down different commission structures and learn how to calculate your actual take-home pay.',
      category: 'Education', 
      readTime: '7 min read',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Real Estate Brokerage Resources
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert guides to help you make informed decisions about your real estate career
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/resources/${post.slug}`}>
                  <article className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-cyan-200 hover:shadow-md transition-all duration-200 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-cyan-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <span className="text-cyan-600 font-medium text-sm hover:text-cyan-700">
                        Read more →
                      </span>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Compare Brokerages?
            </h2>
            <p className="text-xl text-slate-200 mb-8">
              Use our calculator to see exactly how much you could earn at different brokerages
            </p>
            <Link 
              href="/calculator"
              className="inline-block px-8 py-4 bg-cyan-500 text-white text-lg font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Start Your Analysis
            </Link>
          </FadeInUp>
        </div>
      </section>
    </>
  );
}
