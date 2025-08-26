'use client';

import Link from 'next/link';
import { BrokerageCompassIcon } from '../../components/Logo';

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <BrokerageCompassIcon size={32} />
                <h1 className="text-xl font-bold text-slate-700">
                  BrokerageCompass
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-slate-600 transition-colors">
                Home
              </Link>
              <Link href="/calculator" className="text-gray-700 hover:text-slate-600 transition-colors">
                Calculator
              </Link>
              <Link href="/resources" className="text-slate-600 font-semibold">
                Resources
              </Link>
              <Link 
                href="/calculator"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <BrokerageCompassIcon size={32} variant="white" />
                <h3 className="text-xl font-bold text-white">BrokerageCompass</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Navigate your real estate career with confidence. Professional brokerage comparison tool built by an agent, for agents.
              </p>
              <p className="text-gray-500 text-sm">
                © 2025 BrokerageCompass. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/calculator" className="hover:text-white">Commission Calculator</Link></li>
                <li><Link href="/resources" className="hover:text-white">Educational Resources</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/resources/how-to-compare-real-estate-brokerages" className="hover:text-white">Brokerage Comparison Guide</Link></li>
                <li><Link href="/resources/understanding-revenue-share-programs" className="hover:text-white">Revenue Share Guide</Link></li>
                <li><Link href="/resources/cloud-vs-traditional-brokerages" className="hover:text-white">Cloud vs Traditional</Link></li>
                <li><Link href="/resources/commission-splits-explained" className="hover:text-white">Commission Splits</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
