'use client'
import { useState } from 'react'
import { trackCalculatorUsage, trackReferralClick } from '@/utils/analytics'
import BrokerageDisclaimer from './BrokerageDisclaimer'

export default function RealBrokerageCalculator() {
  const [gci, setGci] = useState(80000)
  const [transactions, setTransactions] = useState(20)
  const [recruits, setRecruits] = useState(0)
  const [isHighProducer, setIsHighProducer] = useState(false)
  
  // Real Brokerage specific calculations with correct fee structure
  const calculateRealEarnings = () => {
    // Constants based on official Real Brokerage documentation
    const COMMISSION_SPLIT = 0.85
    const ANNUAL_CAP = 12000
    const BEOP_FEE = 30
    const ANNUAL_FEE = 750
    const POST_CAP_TRANSACTION_FEE = 285
    const ELITE_TRANSACTION_FEE = 129
    
    // Pre-cap calculations
    const companySplitFees = gci * (1 - COMMISSION_SPLIT) // 15% of GCI
    const cappedSplitFees = Math.min(companySplitFees, ANNUAL_CAP)
    
    // BEOP fees apply to ALL transactions
    const beopFees = transactions * BEOP_FEE
    
    // Total fees before considering post-cap transactions
    const totalPreCapFees = cappedSplitFees + beopFees + ANNUAL_FEE
    
    // Determine if agent caps during the year
    const agentCaps = companySplitFees >= ANNUAL_CAP
    
    let postCapTransactionFees = 0
    let postCapCommission = 0
    
    if (agentCaps) {
      // Calculate post-cap transactions and fees
      const gciToCap = ANNUAL_CAP / (1 - COMMISSION_SPLIT) // ~$80,000 GCI to cap
      const postCapGci = Math.max(0, gci - gciToCap)
      
      // Post-cap transactions (estimate based on remaining GCI)
      const avgCommissionPerTransaction = gci / transactions
      const postCapTransactions = Math.floor(postCapGci / avgCommissionPerTransaction)
      
      // Apply correct transaction fees
      const transactionFee = isHighProducer ? ELITE_TRANSACTION_FEE : POST_CAP_TRANSACTION_FEE
      postCapTransactionFees = postCapTransactions * transactionFee
      
      postCapCommission = postCapGci
    }
    
    // Calculate final numbers
    const preCapCommission = Math.min(gci, ANNUAL_CAP / (1 - COMMISSION_SPLIT)) * COMMISSION_SPLIT
    const totalCommission = preCapCommission + postCapCommission
    const totalFees = totalPreCapFees + postCapTransactionFees
    
    // The net income should be GCI minus all fees, not commission minus fees
    // This is because the company split is already accounted for in the fees
    const netIncome = gci - totalFees
    
    // Revenue share calculation (simplified)
    const revenueShare = recruits * 4000 // Up to $4,000 per Tier 1 recruit
    
    // Stock awards for high producers
    const stockAwards = isHighProducer && gci >= 250000 ? 16000 : 0
    
    const totalAnnualIncome = netIncome + revenueShare + stockAwards
    
    return {
      grossCommissionIncome: gci,
      commission: totalCommission,
      fees: totalFees,
      breakdown: {
        companySplit: cappedSplitFees,
        beopFees: beopFees,
        annualFee: ANNUAL_FEE,
        postCapTransactionFees: postCapTransactionFees
      },
      revenueShare,
      stockAwards,
      netIncome,
      totalAnnualIncome,
      agentCaps,
      capReachedAt: agentCaps ? `${Math.round((ANNUAL_CAP / (gci * (1 - COMMISSION_SPLIT))) * 12)} months` : 'Does not cap'
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
              <span className="text-slate-600">Gross Commission Income</span>
              <span className="font-semibold text-lg">${results.grossCommissionIncome.toLocaleString()}</span>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-slate-800 mb-3">Fee Breakdown:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Company split (15%)</span>
                  <span className="text-red-600">-${results.breakdown.companySplit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">BEOP fees ({transactions} × $30)</span>
                  <span className="text-red-600">-${results.breakdown.beopFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual brokerage fee</span>
                  <span className="text-red-600">-${results.breakdown.annualFee.toLocaleString()}</span>
                </div>
                {results.breakdown.postCapTransactionFees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Post-cap transaction fees</span>
                    <span className="text-red-600">-${results.breakdown.postCapTransactionFees.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t pt-2">
                  <span className="text-slate-800">Total Fees</span>
                  <span className="text-red-600">-${results.fees.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Net Commission Income</span>
                <span className="text-2xl font-bold text-green-600">${results.netIncome.toLocaleString()}</span>
              </div>
              
              {results.revenueShare > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-600">Revenue Share</span>
                  <span className="text-lg font-semibold text-green-600">+${results.revenueShare.toLocaleString()}</span>
                </div>
              )}
              
              {results.stockAwards > 0 && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-600">Stock Awards</span>
                  <span className="text-lg font-semibold text-green-600">+${results.stockAwards.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-xl font-bold">Total Annual Income</span>
                <span className="text-3xl font-bold text-cyan-600">${results.totalAnnualIncome.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded text-sm text-slate-600">
              <p><strong>Cap Status:</strong> {results.capReachedAt}</p>
              {results.agentCaps && (
                <p className="mt-1">After capping: 100% commission retention with ${isHighProducer ? '129' : '285'} transaction fee per deal</p>
              )}
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
            <h4 className="font-semibold text-cyan-800 mb-2">Ready to join Real Brokerage?</h4>
            <p className="text-sm text-cyan-700 mb-3">
              Based on your numbers, you could earn ${results.totalAnnualIncome.toLocaleString()} annually with Real Brokerage.
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
      
      <BrokerageDisclaimer 
        brokerageName="Real Brokerage"
        lastUpdated="August 2025"
        sourceUrl="https://support.therealbrokerage.com/hc/en-us/articles/14359725818519"
      />
    </div>
  )
}
