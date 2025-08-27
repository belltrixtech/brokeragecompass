import { Metadata } from 'next';
import { getBlogPost } from '../../utils/blogData';

export const metadata: Metadata = {
  title: 'Real Estate Brokerage Resources & Guides | BrokerageCalc',
  description: 'Expert guides on choosing the right real estate brokerage, understanding commission splits, revenue share, and maximizing your agent career.',
  keywords: [
    'real estate brokerage guides',
    'commission splits',
    'revenue share',
    'real estate agent resources',
    'brokerage comparison',
    'agent earnings'
  ],
  openGraph: {
    title: 'Real Estate Brokerage Resources & Guides',
    description: 'Expert guides on choosing the right real estate brokerage, understanding commission splits, revenue share, and maximizing your agent career.',
    url: 'https://brokeragecalc.com/resources',
    siteName: 'BrokerageCalc',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Brokerage Resources & Guides',
    description: 'Expert guides on choosing the right real estate brokerage and maximizing your agent career.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export function generateArticleMetadata(slug: string): Metadata {
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Article Not Found | BrokerageCalc',
      description: 'The requested article could not be found.',
    };
  }

  const baseUrl = 'https://brokeragecalc.com';
  const articleUrl = `${baseUrl}/resources/${slug}`;

  return {
    title: `${post.title} | BrokerageCalc`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: 'BrokerageCalc Team' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: articleUrl,
      siteName: 'BrokerageCalc',
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}
