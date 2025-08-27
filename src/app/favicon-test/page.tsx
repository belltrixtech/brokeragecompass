'use client';

import { FaviconGenerator } from '../../components/FaviconGenerator';

export default function FaviconTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Favicon Test & Generator
          </h1>
          <p className="text-lg text-gray-600">
            Test your favicons and generate all required formats for BrokerageCalc
          </p>
        </div>

        {/* Current Favicon Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Favicon Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Browser Tab Preview */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Browser Tab</h3>
              <div className="flex items-center gap-2 bg-white p-2 rounded border">
                <img src="/favicon.svg" alt="Favicon" className="w-4 h-4" />
                <span className="text-sm text-gray-700">BrokerageCalc</span>
              </div>
            </div>

            {/* Bookmark Preview */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Bookmark</h3>
              <div className="flex items-center gap-2 bg-white p-2 rounded border">
                <img src="/favicon-32x32.png" alt="Favicon 32x32" className="w-6 h-6" onError={(e) => {
                  e.currentTarget.src = '/favicon.svg';
                }} />
                <span className="text-sm text-gray-700">BrokerageCalc</span>
              </div>
            </div>

            {/* Mobile Home Screen */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Mobile Home Screen</h3>
              <div className="flex flex-col items-center gap-2">
                <img src="/apple-touch-icon.png" alt="Apple Touch Icon" className="w-16 h-16 rounded-lg" onError={(e) => {
                  e.currentTarget.src = '/favicon.svg';
                }} />
                <span className="text-xs text-gray-700 text-center">BrokerageCalc</span>
              </div>
            </div>

            {/* Android Chrome */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Android Chrome (192x192)</h3>
              <div className="flex flex-col items-center gap-2">
                <img src="/android-chrome-192x192.png" alt="Android Chrome 192" className="w-12 h-12 rounded" onError={(e) => {
                  e.currentTarget.src = '/favicon.svg';
                }} />
                <span className="text-xs text-gray-700 text-center">Chrome Icon</span>
              </div>
            </div>

            {/* Android Chrome Large */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Android Chrome (512x512)</h3>
              <div className="flex flex-col items-center gap-2">
                <img src="/android-chrome-512x512.png" alt="Android Chrome 512" className="w-16 h-16 rounded" onError={(e) => {
                  e.currentTarget.src = '/icon-512.svg';
                }} />
                <span className="text-xs text-gray-700 text-center">App Icon</span>
              </div>
            </div>

            {/* ICO Fallback */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">ICO Fallback</h3>
              <div className="flex items-center gap-2 bg-white p-2 rounded border">
                <img src="/favicon.ico" alt="Favicon ICO" className="w-4 h-4" onError={(e) => {
                  e.currentTarget.src = '/favicon.svg';
                }} />
                <span className="text-sm text-gray-700">Legacy Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Favicon Generator Component */}
        <FaviconGenerator />

        {/* Installation Guide */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">Implementation Checklist</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium">SVG Favicon Created</h3>
                <p className="text-sm text-gray-600">Modern browsers will use /favicon.svg</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Web App Manifest</h3>
                <p className="text-sm text-gray-600">PWA support with /site.webmanifest</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                ✓
              </div>
              <div>
                <h3 className="font-medium">Meta Tags Configured</h3>
                <p className="text-sm text-gray-600">All favicon links added to layout.tsx</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                !
              </div>
              <div>
                <h3 className="font-medium">Generate PNG Files</h3>
                <p className="text-sm text-gray-600">Use the generator above to create all required PNG formats</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                i
              </div>
              <div>
                <h3 className="font-medium">Test Across Devices</h3>
                <p className="text-sm text-gray-600">Check favicon display on desktop, mobile, and tablet browsers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
