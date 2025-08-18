interface SocialSharingProps {
  title: string
  url: string
}

export default function SocialSharing({ title, url }: SocialSharingProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Share this article</h4>
      <div className="flex space-x-4">
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          Share on Twitter
        </a>
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          Share on LinkedIn
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          Share on Facebook
        </a>
      </div>
    </div>
  )
}
