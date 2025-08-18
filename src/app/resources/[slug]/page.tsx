import Link from 'next/link';
import { FadeInUp } from '../../../components/Animations';
import { getBlogPost } from '../../../utils/blogData';
import { generateArticleMetadata } from '../metadata';
import { notFound } from 'next/navigation';
import ArticleSchema from '../../../components/ArticleSchema';
import RelatedArticles from '../../../components/RelatedArticles';
import SocialSharing from '../../../components/SocialSharing';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateArticleMetadata(slug);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  const baseUrl = 'https://brokeragecompass.com';
  const articleUrl = `${baseUrl}/resources/${slug}`;

  return (
    <>
      <ArticleSchema 
        title={post.title}
        description={post.excerpt}
        publishDate={post.date}
        author="BrokerageCompass Team"
        url={articleUrl}
      />
      
      <div className="min-h-screen bg-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeInUp>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-gray-500">{post.readTime}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <p className="text-gray-600">
                Published {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </FadeInUp>

          {/* Social Sharing */}
          <FadeInUp delay={0.3}>
            <SocialSharing title={post.title} url={articleUrl} />
          </FadeInUp>

          {/* Related Articles */}
          <FadeInUp delay={0.4}>
            <RelatedArticles currentSlug={slug} />
          </FadeInUp>

          {/* Navigation to other posts */}
          <FadeInUp delay={0.5}>
            <div className="border-t border-gray-200 pt-8 mt-12">
              <Link 
                href="/resources"
                className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
              >
                ← Back to Resources
              </Link>
            </div>
          </FadeInUp>

          {/* CTA Section */}
          <FadeInUp delay={0.6}>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Run Your Numbers?
              </h3>
              <p className="text-gray-600 mb-6">
                Use our calculator to see exactly how different brokerages would impact your income
              </p>
              <Link 
                href="/calculator"
                className="inline-block px-8 py-4 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Calculate Your Earnings
              </Link>
            </div>
          </FadeInUp>
        </article>
      </div>
    </>
  );
}
