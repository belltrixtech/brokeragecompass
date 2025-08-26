import { Metadata } from 'next'
import Link from 'next/link'
import RealBrokerageCalculator from '@/components/RealBrokerageCalculator'
import ArticleSchema from '@/components/ArticleSchema'

export const metadata: Metadata = {
  title: 'Real Brokerage Commission Calculator 2025 - Calculate Your Earnings | BrokerageCompass',
  description: 'Calculate your potential earnings with Real Brokerage. Compare commission splits, revenue share, stock awards, and total annual income. Free calculator tool.',
  keywords: [
    'Real Brokerage calculator',
    'Real Brokerage commission',
    'Real Brokerage revenue share',
    'Real Brokerage earnings',
    'Real Brokerage stock awards',
    'real estate commission calculator'
  ],
  openGraph: {
    title: 'Real Brokerage Commission Calculator 2025',
    description: 'Calculate your potential earnings with Real Brokerage including commission splits, revenue share, and stock awards.',
    url: 'https://brokeragecompass.com/calculators/real-brokerage',
    type: 'article',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RealBrokerageCalculatorPage() {
  return (
    <>
      <ArticleSchema 
        title="Real Brokerage Commission Calculator 2025"
        description="Calculate your potential earnings with Real Brokerage including commission splits, revenue share, and stock awards."
        publishDate="2025-01-20"
        author="BrokerageCompass Team"
        url="https://brokeragecompass.com/calculators/real-brokerage"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Real Brokerage Commission Calculator
              </h1>
              <p className="text-xl text-slate-200 mb-8">
                Calculate your exact earnings potential with Real Brokerage's 85/15 split, 
                revenue share program, and stock awards. See how much you could earn annually.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-sm text-slate-300">Commission Split</span>
                  <div className="text-2xl font-bold">85/15</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-sm text-slate-300">Annual Cap</span>
                  <div className="text-2xl font-bold">$12,000</div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-sm text-slate-300">Revenue Share</span>
                  <div className="text-2xl font-bold">Up to $4,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <RealBrokerageCalculator />
        </div>

        {/* Benefits Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Agents Choose Real Brokerage
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Low $12K Cap</h3>
                <p className="text-slate-600">
                  One of the lowest caps in the industry. Keep 100% commission after reaching just $12,000 in fees.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Revenue Share</h3>
                <p className="text-slate-600">
                  Earn up to $4,000 annually per agent you recruit. Build passive income through your network.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Stock Awards</h3>
                <p className="text-slate-600">
                  Qualify for up to $16,000 in annual stock awards based on production and recruiting performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Real Brokerage Calculator FAQ
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold mb-2">
                  How accurate is this Real Brokerage calculator?
                </h3>
                <p className="text-slate-600">
                  Our calculator uses official Real Brokerage commission structures and fee schedules. 
                  All calculations are based on publicly available information and updated regularly.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold mb-2">
                  What's included in the Real Brokerage calculation?
                </h3>
                <p className="text-slate-600">
                  The calculator includes commission splits (85/15), annual cap ($12,000), 
                  revenue share earnings (up to $4,000 per recruit), and stock award eligibility.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold mb-2">
                  How does Real Brokerage compare to other brokerages?
                </h3>
                <p className="text-slate-600">
                  Real Brokerage typically offers higher net income due to its low $12K cap and 
                  generous revenue share program. Use our full comparison tool to see exact differences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-linking back to main calculator */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h4 className="font-semibold text-slate-800 mb-1">Want to Compare Multiple Brokerages?</h4>
                <p className="text-slate-600 text-sm">See how Real Brokerage stacks up against other top options.</p>
              </div>
              <Link
                href="/calculator"
                className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compare All Brokerages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
