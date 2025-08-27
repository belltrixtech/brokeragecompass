interface ArticleSchemaProps {
  title: string
  description: string
  publishDate: string
  author: string
  url: string
}

export default function ArticleSchema({ 
  title, 
  description, 
  publishDate, 
  author, 
  url 
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": publishDate,
    "dateModified": publishDate,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "BrokerageCalc",
      "logo": {
        "@type": "ImageObject",
        "url": "https://brokeragecalc.com/favicon.svg"
      }
    },
    "url": url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
