import Link from 'next/link';

const relatedArticles = [
  {
    title: "Understanding Revenue Share Programs",
    excerpt: "Learn how revenue share works and maximize your earning potential...",
    href: "/resources/understanding-revenue-share-programs"
  },
  {
    title: "Cloud vs Traditional Brokerages", 
    excerpt: "Compare the pros and cons of cloud and traditional brokerage models...",
    href: "/resources/cloud-vs-traditional-brokerages"
  },
  {
    title: "How to Compare Real Estate Brokerages",
    excerpt: "Learn the key factors to evaluate when choosing a brokerage...",
    href: "/resources/how-to-compare-real-estate-brokerages"
  },
  {
    title: "Commission Splits Explained",
    excerpt: "Break down different commission structures and learn how to calculate your actual take-home pay...",
    href: "/resources/commission-splits-explained"
  }
]

export default function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const filteredArticles = relatedArticles.filter(article => 
    !article.href.includes(currentSlug)
  ).slice(0, 2) // Show only 2 related articles

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">Related Articles</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {filteredArticles.map((article, index) => (
          <Link 
            key={index}
            href={article.href}
            className="block p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-cyan-200 transition-all duration-200"
          >
            <h4 className="font-medium text-slate-800 mb-2 hover:text-cyan-600 transition-colors">
              {article.title}
            </h4>
            <p className="text-sm text-slate-600">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
