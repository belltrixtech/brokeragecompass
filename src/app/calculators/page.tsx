import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Real Estate Brokerage Calculators | BrokerageCompass',
  description: 'Calculate earnings for specific real estate brokerages. Dedicated calculators for Real Brokerage, eXp Realty, and more.',
  keywords: [
    'real estate calculator',
    'brokerage calculator',
    'commission calculator',
    'Real Brokerage calculator',
    'eXp calculator'
  ],
  openGraph: {
    title: 'Real Estate Brokerage Calculators',
    description: 'Calculate earnings for specific real estate brokerages. Dedicated calculators for Real Brokerage, eXp Realty, and more.',
    url: 'https://brokeragecompass.com/calculators',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CalculatorsPage() {
  const calculators = [
    {
      name: 'Real Brokerage Calculator',
      href: '/calculators/real-brokerage',
      description: 'Calculate your earnings with Real\'s 85/15 split, $12K cap, and revenue share program.',
      features: ['85/15 Commission Split', '$12,000 Annual Cap', 'Revenue Share Program', 'Stock Awards'],
      logo: '/logos/real-brokerage-logo.png',
      popular: true
    },
    {
      name: 'eXp Realty Calculator',
      href: '/calculators/exp-realty',
      description: 'Calculate eXp earnings including revenue share, stock awards, and ICON agent benefits.',
      features: ['80/20 Commission Split', '$16,000 Annual Cap', 'Revenue Share Program', 'Stock Program'],
      logo: '/logos/exp-realty-logo.png',
      comingSoon: true
    },
    {
      name: 'Compare All Brokerages',
      href: '/calculator',
      description: 'Compare earnings across all cloud and traditional brokerages side-by-side.',
      features: ['8 Brokerages Compared', 'Cloud vs Traditional', 'Revenue Share Analysis', 'Current vs New'],
      logo: '/favicon.svg',
      isComparison: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Estate Brokerage Calculators
            </h1>
            <p className="text-xl text-slate-200 mb-8">
              Calculate your earnings potential with specific brokerages or compare them all. 
              Choose the tool that fits your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Calculators Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calculators.map((calc, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className={`p-6 ${calc.isComparison ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' : 'bg-slate-50'} relative`}>
                {calc.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Image
                      src={calc.logo}
                      alt={calc.name}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className={`text-xl font-bold ${calc.isComparison ? 'text-white' : 'text-slate-800'}`}>
                    {calc.name}
                  </h3>
                </div>
                
                <p className={`${calc.isComparison ? 'text-cyan-100' : 'text-slate-600'}`}>
                  {calc.description}
                </p>
              </div>

              {/* Features */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {calc.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                {calc.comingSoon ? (
                  <div className="w-full py-3 px-4 bg-slate-100 text-slate-500 text-center font-medium rounded-lg">
                    Coming Soon
                  </div>
                ) : (
                  <Link
                    href={calc.href}
                    className={`block w-full text-center py-3 px-4 font-medium rounded-lg transition-colors ${
                      calc.isComparison
                        ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                        : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    {calc.isComparison ? 'Compare All Brokerages' : 'Use Calculator'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-slate-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Not Sure Which Calculator to Use?
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            If you're exploring multiple brokerages or don't know which one fits best, 
            start with our comprehensive comparison tool. If you're focused on a specific 
            brokerage, use the dedicated calculator for detailed earnings projections.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Start with Full Comparison
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
