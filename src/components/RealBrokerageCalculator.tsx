'use client'
import { useState } from 'react'
import { trackCalculatorUsage, trackReferralClick } from '@/utils/analytics'

export default function RealBrokerageCalculator() {
  const [gci, setGci] = useState(80000)
  const [transactions, setTransactions] = useState(20)
  const [recruits, setRecruits] = useState(0)
  const [isHighProducer, setIsHighProducer] = useState(false)
  
  // Real Brokerage specific calculations
  const calculateRealEarnings = () => {
    const split = 0.85
    const cap = 12000
    const fees = Math.min(gci * (1 - split), cap)
    const commission = gci - fees
    
    // Revenue share: $4000 per recruit (simplified)
    const revenueShare = recruits * 4000
    
    // Stock awards for high producers
    const stockAwards = isHighProducer && gci >= 250000 ? 16000 : 0
    
    const totalEarnings = commission + revenueShare + stockAwards
    
    return {
      commission,
      fees,
      revenueShare,
      stockAwards,
      totalEarnings
    }
  }
  
  const results = calculateRealEarnings()
  
  const handleCalculate = () => {
    trackCalculatorUsage({
      gci: gci,
      transactions: transactions,
      currentBrokerage: 'Real Brokerage',
      recruitedAgents: recruits,
    })
  }
  
  const handleReferralClick = () => {
    trackReferralClick('Real Brokerage', gci, results.totalEarnings - gci)
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Real Brokerage Earnings Calculator</h2>
        <p className="text-slate-200 mt-1">Calculate your total potential income with Real Brokerage</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 p-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Annual GCI (Gross Commission Income)
            </label>
            <input
              type="number"
              value={gci}
              onChange={(e) => setGci(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="80000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transactions per Year
            </label>
            <input
              type="number"
              value={transactions}
              onChange={(e) => setTransactions(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Agents You Plan to Recruit
            </label>
            <input
              type="number"
              value={recruits}
              onChange={(e) => setRecruits(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highProducer"
              checked={isHighProducer}
              onChange={(e) => setIsHighProducer(e.target.checked)}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-slate-300 rounded"
            />
            <label htmlFor="highProducer" className="ml-2 block text-sm text-slate-700">
              High producer (qualify for stock awards)
            </label>
          </div>
          
          <button
            onClick={handleCalculate}
            className="w-full bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Calculate My Real Brokerage Earnings
          </button>
        </div>
        
        {/* Results Section */}
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Potential Annual Earnings</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Commission (after fees)</span>
              <span className="font-semibold text-lg">${results.commission.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Annual fees paid</span>
              <span className="font-semibold text-red-600">-${results.fees.toLocaleString()}</span>
            </div>
            
            {results.revenueShare > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Revenue share</span>
                <span className="font-semibold text-green-600">+${results.revenueShare.toLocaleString()}</span>
              </div>
            )}
            
            {results.stockAwards > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Stock awards</span>
                <span className="font-semibold text-green-600">+${results.stockAwards.toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Annual Income</span>
                <span className="text-2xl font-bold text-cyan-600">${results.totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
            <h4 className="font-semibold text-cyan-800 mb-2">Ready to join Real Brokerage?</h4>
            <p className="text-sm text-cyan-700 mb-3">
              Based on your numbers, you could earn ${results.totalEarnings.toLocaleString()} annually with Real Brokerage.
            </p>
            <a
              href="https://bolt.therealbrokerage.com/register?sponsorCode=4oryuip&sponsorName=Nick%20Bellante"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleReferralClick}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Join Real Brokerage
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
