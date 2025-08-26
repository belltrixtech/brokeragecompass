export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  keywords: string[];
}

export const formatDateForSEO = (date: Date) => {
  return {
    display: date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    iso: date.toISOString(),
    schema: date.toISOString().split('T')[0] // YYYY-MM-DD format for schema markup
  };
};

export const getBlogPost = (slug: string): BlogPost | null => {
  const posts: Record<string, BlogPost> = {
    'how-to-compare-real-estate-brokerages': {
      slug: 'how-to-compare-real-estate-brokerages',
      title: 'How to Compare Real Estate Brokerages: Complete 2025 Guide',
      excerpt: 'Learn the key factors to evaluate when choosing a brokerage, from commission splits to support systems.',
      content: `
        <div class="prose prose-lg max-w-none">
          <p class="text-xl text-gray-600 mb-8">Choosing the right real estate brokerage is one of the most important decisions in your career. Here's how to evaluate your options systematically in 2025.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Factors to Evaluate</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Commission Structure</h3>
          <p class="text-gray-700 mb-4">Understanding how much you'll actually take home is crucial. Look beyond the headline split percentage:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Commission split percentage</strong> - What you keep vs. what the brokerage takes</li>
            <li><strong>Annual caps</strong> - Maximum amount you'll pay the brokerage per year</li>
            <li><strong>Transaction fees</strong> - Additional fees per deal</li>
            <li><strong>Monthly desk fees</strong> - Ongoing costs regardless of production</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Revenue Share Opportunities</h3>
          <p class="text-gray-700 mb-4">Many modern brokerages offer revenue sharing when you refer other agents. This can become significant passive income:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Percentage of revenue shared</li>
            <li>Number of tiers in the program</li>
            <li>Requirements to unlock higher tiers</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Technology and Tools</h3>
          <p class="text-gray-700 mb-4">Evaluate the quality and comprehensiveness of provided tools:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>CRM systems</li>
            <li>Marketing platforms</li>
            <li>Transaction management</li>
            <li>Lead generation tools</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Training and Support</h3>
          <p class="text-gray-700 mb-4">Especially important for newer agents:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Onboarding programs</li>
            <li>Ongoing education</li>
            <li>Mentorship opportunities</li>
            <li>Administrative support</li>
          </ul>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Making the Decision</h2>
          <p class="text-gray-700 mb-6">Use tools like the <a href="/calculator" class="text-cyan-600 hover:text-cyan-700 font-medium">BrokerageCompass calculator</a> to run the numbers on your specific situation. Remember, the cheapest option isn't always the best if it doesn't provide the support you need to succeed.</p>
          
          <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6 my-8">
            <h3 class="text-lg font-semibold text-cyan-900 mb-2">Quick Tip</h3>
            <p class="text-cyan-800 mb-0">Calculate your net income at each brokerage based on your expected production, not just the commission split percentage. Factors like caps, fees, and revenue share can dramatically change the actual numbers.</p>
          </div>
        </div>
      `,
      date: '2025-01-17',
      readTime: '8 min read',
      category: 'Guides',
      keywords: ['real estate brokerage comparison', 'commission splits', 'brokerage evaluation', 'agent career']
    },
    
    'understanding-revenue-share-programs': {
      slug: 'understanding-revenue-share-programs',
      title: 'Understanding Revenue Share Programs: Build Passive Income',
      excerpt: 'Discover how revenue share works and why it could be a game-changer for your real estate career.',
      content: `
        <div class="prose prose-lg max-w-none">
          <p class="text-xl text-gray-600 mb-8">Revenue share programs can provide substantial passive income for real estate agents. Here's everything you need to know about how they work.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Revenue Share?</h2>
          <p class="text-gray-700 mb-6">Revenue share is when a brokerage shares a percentage of the commission income generated by agents you recruit to the company. Instead of keeping 100% of recruit commissions, the brokerage pays you a portion as long as your recruits remain active.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">How Revenue Share Programs Work</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Multi-Tier Structure</h3>
          <p class="text-gray-700 mb-4">Most programs operate on multiple levels:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Level 1:</strong> Agents you directly recruit</li>
            <li><strong>Level 2:</strong> Agents recruited by your Level 1 agents</li>
            <li><strong>Level 3+:</strong> Additional levels based on program structure</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Typical Percentages</h3>
          <p class="text-gray-700 mb-4">Revenue share percentages vary by brokerage:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Cloud Brokerage A:</strong> 5% on Level 1, decreasing by 1% per level</li>
            <li><strong>eXp Realty:</strong> 3.5% on sponsored agents until they cap</li>
            <li><strong>Other brokerages:</strong> Vary widely in structure and percentages</li>
          </ul>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Building Revenue Share Income</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Start with Quality Recruits</h3>
          <p class="text-gray-700 mb-4">Focus on recruiting productive agents rather than just numbers:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Experienced agents who will do volume</li>
            <li>Agents who understand the value proposition</li>
            <li>Agents who might also recruit others</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Provide Value to Your Recruits</h3>
          <p class="text-gray-700 mb-4">Help your recruits succeed to maximize revenue share:</p>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Onboarding assistance</li>
            <li>Training and mentorship</li>
            <li>Technology help</li>
            <li>Business development support</li>
          </ul>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Revenue Share Calculations</h2>
          <p class="text-gray-700 mb-6">Use the <a href="/calculator" class="text-cyan-600 hover:text-cyan-700 font-medium">BrokerageCompass calculator</a> to model revenue share potential based on different recruiting scenarios. The numbers can be substantial for active recruiters.</p>
          
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-8">
            <h3 class="text-lg font-semibold text-emerald-900 mb-2">Example Scenario</h3>
            <p class="text-emerald-800 mb-2">If you recruit 6 agents who each do $75,000 in GCI annually at a cloud brokerage:</p>
            <p class="text-emerald-800 mb-0"><strong>Potential annual revenue share: $22,500</strong> (5% of their $450,000 combined splits to the brokerage)</p>
          </div>
        </div>
      `,
      date: '2025-01-17',
      readTime: '6 min read',
      category: 'Education',
      keywords: ['revenue share', 'passive income', 'real estate recruiting', 'agent income']
    },

    'cloud-vs-traditional-brokerages': {
      slug: 'cloud-vs-traditional-brokerages',
      title: 'Cloud vs Traditional Brokerages: Which is Right for You?',
      excerpt: 'Compare the pros and cons of modern cloud brokerages versus traditional franchise models.',
      content: `
        <div class="prose prose-lg max-w-none">
          <p class="text-xl text-gray-600 mb-8">The real estate industry has been transformed by cloud-based brokerages. Here's how they compare to traditional models and which might be right for your career.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What Are Cloud Brokerages?</h2>
          <p class="text-gray-700 mb-6">Cloud brokerages operate primarily online with minimal physical presence. Examples include various technology-focused companies like eXp Realty and Compass. They leverage technology to reduce overhead and pass savings to agents through better commission splits.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Traditional Brokerages</h2>
          <p class="text-gray-700 mb-6">Traditional brokerages like Keller Williams, Coldwell Banker, and RE/MAX operate with physical offices and established franchise systems. They emphasize local presence and in-person support.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Differences</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Commission Structures</h3>
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Cloud Brokerages:</h4>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Higher commission splits (85-95%)</li>
              <li>Annual caps on brokerage fees</li>
              <li>Revenue sharing opportunities</li>
            </ul>
            
            <h4 class="font-semibold text-gray-900 mb-2">Traditional Brokerages:</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li>Variable splits (50-90%)</li>
              <li>Monthly desk fees</li>
              <li>Transaction fees</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Support and Training</h3>
          <div class="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Cloud Brokerages:</h4>
            <ul class="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Virtual training programs</li>
              <li>Online collaboration tools</li>
              <li>Digital resource libraries</li>
            </ul>
            
            <h4 class="font-semibold text-gray-900 mb-2">Traditional Brokerages:</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li>In-person training sessions</li>
              <li>Local office support</li>
              <li>Face-to-face mentoring</li>
            </ul>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Which is Right for You?</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Choose Cloud If:</h3>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>You're comfortable with technology</li>
            <li>You're self-motivated and independent</li>
            <li>You want higher commission splits</li>
            <li>You're interested in building passive income through recruiting</li>
          </ul>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Choose Traditional If:</h3>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>You value in-person support</li>
            <li>You're new to real estate</li>
            <li>You prefer established brand recognition</li>
            <li>You want local office resources</li>
          </ul>
          
          <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6 my-8">
            <h3 class="text-lg font-semibold text-cyan-900 mb-2">Run the Numbers</h3>
            <p class="text-cyan-800 mb-0">Use the <a href="/calculator" class="text-cyan-600 hover:text-cyan-700 font-medium">BrokerageCompass calculator</a> to compare actual earnings potential between different cloud and traditional brokerages based on your production level.</p>
          </div>
        </div>
      `,
      date: '2025-01-17',
      readTime: '10 min read',
      category: 'Comparison',
      keywords: ['cloud brokerage', 'traditional brokerage', 'real estate technology', 'brokerage comparison']
    },

    'commission-splits-explained': {
      slug: 'commission-splits-explained',
      title: 'Real Estate Commission Splits Explained: Maximize Your Earnings',
      excerpt: 'Break down different commission structures and learn how to calculate your actual take-home pay.',
      content: `
        <div class="prose prose-lg max-w-none">
          <p class="text-xl text-gray-600 mb-8">Understanding commission splits is crucial for maximizing your earnings as a real estate agent. Here's everything you need to know about how they work.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a Commission Split?</h2>
          <p class="text-gray-700 mb-6">A commission split is the percentage of commission income you keep versus what goes to your brokerage. For example, a 70/30 split means you keep 70% and the brokerage gets 30%.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Commission Structures</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Graduated Splits</h3>
          <p class="text-gray-700 mb-4">Your split improves as you close more transactions or reach higher gross commission income (GCI).</p>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <p class="text-gray-700 mb-2"><strong>Example:</strong></p>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li>First $50K GCI: 60/40 split</li>
              <li>Next $50K GCI: 70/30 split</li>
              <li>Above $100K GCI: 80/20 split</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Flat Rate Splits</h3>
          <p class="text-gray-700 mb-6">Same percentage regardless of production level. Common with cloud brokerages offering 85-95% splits.</p>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Cap Systems</h3>
          <p class="text-gray-700 mb-4">You pay a maximum amount to the brokerage annually, then keep 100% of subsequent commissions.</p>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <p class="text-gray-700 mb-2"><strong>Example:</strong></p>
            <p class="text-gray-700">85/15 split with $12,000 annual cap. Once you've paid $12,000 to the brokerage, you keep 100% for the rest of the year.</p>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Hidden Costs to Consider</h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Transaction Fees</h3>
          <p class="text-gray-700 mb-4">Many brokerages charge $25-$500 per transaction on top of the commission split.</p>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Monthly Desk Fees</h3>
          <p class="text-gray-700 mb-4">Fixed monthly costs ranging from $50-$1,000+ regardless of production.</p>
          
          <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Technology and Marketing Fees</h3>
          <p class="text-gray-700 mb-6">Additional charges for CRM, marketing platforms, and other tools.</p>
          
          <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Calculating Your True Take-Home</h2>
          <p class="text-gray-700 mb-4">To understand your real earnings potential:</p>
          <ol class="list-decimal list-inside text-gray-700 mb-6 space-y-2">
            <li>Calculate commission after split</li>
            <li>Subtract transaction fees</li>
            <li>Subtract annual desk fees</li>
            <li>Add any revenue share income</li>
            <li>Consider stock awards or other benefits</li>
          </ol>
          
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-8">
            <h3 class="text-lg font-semibold text-emerald-900 mb-2">Quick Calculation Example</h3>
            <p class="text-emerald-800 mb-2">$100,000 GCI at 70/30 split with $300/month desk fees:</p>
            <ul class="list-disc list-inside text-emerald-800 space-y-1">
              <li>Commission after split: $70,000</li>
              <li>Annual desk fees: $3,600</li>
              <li><strong>Net income: $66,400</strong></li>
            </ul>
          </div>
          
          <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-6 my-8">
            <h3 class="text-lg font-semibold text-cyan-900 mb-2">Compare Your Options</h3>
            <p class="text-cyan-800 mb-0">Use the <a href="/calculator" class="text-cyan-600 hover:text-cyan-700 font-medium">BrokerageCompass calculator</a> to compare how different commission structures would affect your take-home pay based on your production goals.</p>
          </div>
        </div>
      `,
      date: '2025-01-17',
      readTime: '7 min read',
      category: 'Education',
      keywords: ['commission splits', 'real estate earnings', 'agent income', 'brokerage fees']
    },

    'real-brokerage-vs-exp-realty': {
      slug: 'real-brokerage-vs-exp-realty',
      title: 'Real Brokerage vs eXp Realty 2025: Complete Comparison',
      excerpt: 'Compare Real Brokerage vs eXp Realty commission splits, revenue share programs, caps, and total earnings potential. Data-driven analysis for 2025.',
      content: '', // Content is in the dedicated page component
      date: '2025-08-26',
      readTime: '8 min read',
      category: 'Comparison',
      keywords: ['Real Brokerage vs eXp Realty', 'Real vs eXp', 'cloud brokerage comparison', 'revenue share comparison', 'Real Brokerage eXp comparison', 'best cloud brokerage 2025']
    }
  };

  return posts[slug] || null;
};

export const getAllBlogPosts = (): BlogPost[] => {
  const slugs = [
    'real-brokerage-vs-exp-realty',
    'how-to-compare-real-estate-brokerages',
    'understanding-revenue-share-programs', 
    'cloud-vs-traditional-brokerages',
    'commission-splits-explained'
  ];
  
  return slugs.map(slug => getBlogPost(slug)).filter(Boolean) as BlogPost[];
};
