import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  BrokerageCompass
                </h1>
              </div>
            </div>
            <Link
              href="/calculator"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Indicator */}
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Trusted by 1,000+ Real Estate Agents
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Navigate Your Real Estate Career.
              <span className="text-blue-600 block">Make Informed Decisions.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Professional brokerage comparison tool. Compare commission splits, fees, revenue share, and stock awards to find the perfect fit for your career.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/calculator"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
              >
                Start Comparison
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-300 w-full sm:w-auto">
                View Demo
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M13 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
                <div className="text-gray-600">Top Brokerages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-gray-600">Calculation Factors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$100K+</div>
                <div className="text-gray-600">Average Savings Found</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Make the Right Choice
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive calculator analyzes every aspect of your potential earnings 
              to help you choose the brokerage that maximizes your income.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Commission Calculator */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Commission Calculator
              </h3>
              <p className="text-gray-600 leading-relaxed">
                See your exact take-home pay after splits, caps, and fees across all major cloud brokerages.
              </p>
            </div>

            {/* Revenue Share Analysis */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Revenue Share Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Understand your recruiting potential with multi-tier revenue share calculations and projections.
              </p>
            </div>

            {/* Stock Awards */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Stock Awards
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Calculate bonus opportunities and stock award potential based on your production level.
              </p>
            </div>

            {/* Timeline Projections */}
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Timeline Projections
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Know exactly when you'll hit your cap and start earning 100% commission retention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brokerages Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Compare Top Cloud Brokerages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get detailed analysis of leading cloud brokerages with competitive splits and innovative models.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Brokerage</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between">
                  <span>Split:</span>
                  <span className="font-semibold">85/15</span>
                </p>
                <p className="flex justify-between">
                  <span>Cap:</span>
                  <span className="font-semibold">$12K</span>
                </p>
                <p className="flex justify-between">
                  <span>Stock Awards:</span>
                  <span className="font-semibold">Up to $24K</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">eXp Realty</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between">
                  <span>Split:</span>
                  <span className="font-semibold">80/20</span>
                </p>
                <p className="flex justify-between">
                  <span>Cap:</span>
                  <span className="font-semibold">$16K</span>
                </p>
                <p className="flex justify-between">
                  <span>Stock Awards:</span>
                  <span className="font-semibold">Up to $16K</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Epique Realty</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between">
                  <span>Split:</span>
                  <span className="font-semibold">85/15</span>
                </p>
                <p className="flex justify-between">
                  <span>Cap:</span>
                  <span className="font-semibold">$15K</span>
                </p>
                <p className="flex justify-between">
                  <span>Stock Awards:</span>
                  <span className="font-semibold">Up to $15K</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">LPT Realty</h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex justify-between">
                  <span>Split:</span>
                  <span className="font-semibold">80/20</span>
                </p>
                <p className="flex justify-between">
                  <span>Cap:</span>
                  <span className="font-semibold">$15K</span>
                </p>
                <p className="flex justify-between">
                  <span>Stock Awards:</span>
                  <span className="font-semibold">Up to $5K</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join Thousands of Agents Making Smarter Decisions
            </h2>
            <p className="text-xl text-gray-600">
              Real estate professionals trust our calculator to make informed brokerage choices
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Mitchell</h4>
                  <p className="text-gray-600">Top Producer, Austin TX</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "This calculator saved me $15K annually. I had no idea about the revenue share differences until I used this tool."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Robert Johnson</h4>
                  <p className="text-gray-600">Team Leader, Miami FL</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Finally, a tool that shows the complete picture. The stock award calculations were eye-opening."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  LC
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Lisa Chen</h4>
                  <p className="text-gray-600">New Agent, San Diego CA</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As a new agent, this helped me understand which brokerage would support my growth best. Invaluable resource!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Compare Your Options?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Get your personalized comparison in minutes. See exactly how much you could earn with each brokerage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/calculator"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
            >
              Start Calculator
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors border border-blue-400 w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">BrokerageCompass</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Navigate your real estate career with confidence. Professional brokerage comparison tool to help agents make data-driven decisions about their future.
              </p>
              <p className="text-gray-500 text-sm">
                © 2024 BrokerageCompass. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Commission Calculator</li>
                <li>Revenue Share Analysis</li>
                <li>Stock Award Projections</li>
                <li>Timeline Analysis</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Brokerages</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Real Brokerage</li>
                <li>eXp Realty</li>
                <li>Epique Realty</li>
                <li>LPT Realty</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
