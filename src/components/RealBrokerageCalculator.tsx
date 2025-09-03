'use client'
import { useState } from 'react'
import { trackCalculatorUsage, trackReferralClick } from '@/utils/analytics'
import BrokerageDisclaimer from './BrokerageDisclaimer'

export default function RealBrokerageCalculator() {
  const [gci, setGci] = useState(80000)
  const [transactions, setTransactions] = useState(20)
  const [recruits, setRecruits] = useState(0)
  const [sppParticipation, setSppParticipation] = useState(true)
  
  // Complete Real Brokerage stock awards calculation
  const calculateRealStockAwards = (gci, transactions, sppParticipation = false, recruits = 0) => {
    let totalStockAwards = 0;
    let eliteAgent = false;
    let cappingAward = 0;
    let sppBonusShares = 0;
    let eliteAward = 0;
    let culturalAward = 0;
    let recruitmentAwards = 0;
    
    // 1. CAPPING AWARD - Available to all agents who reach $12K cap
    const companySplit = Math.min(gci * 0.15, 12000);
    const agentCaps = companySplit >= 12000;
    
    if (agentCaps) {
      cappingAward = 4000; // $4,000 stock award for reaching cap
    }
    
    // 2. STOCK PURCHASE PLAN (SPP) BONUS SHARES
    if (sppParticipation && gci > 0) {
      const gciToCap = 12000 / 0.15; // $80,000 GCI to cap
      
      if (agentCaps) {
        // Pre-cap: 5% contribution + 10% bonus
        const preCapGci = Math.min(gci, gciToCap);
        const preCapContribution = preCapGci * 0.05;
        const preCapBonus = preCapContribution * 0.10;
        
        // Post-cap: 10% contribution + 15% bonus (up to $15K annual limit)
        const postCapGci = Math.max(0, gci - gciToCap);
        const postCapContribution = Math.min(postCapGci * 0.10, 15000);
        const postCapBonus = postCapContribution * 0.15;
        
        sppBonusShares = preCapBonus + postCapBonus;
      } else {
        // Pre-cap only: 5% contribution + 10% bonus
        const preCapContribution = gci * 0.05;
        sppBonusShares = preCapContribution * 0.10;
      }
    }
    
    // 3. ELITE AGENT AWARD - $16K for high producers
    if (agentCaps) {
      // Path 1: Post-cap production method
      const gciToCap = 12000 / 0.15; // $80,000 GCI to cap
      const postCapGci = Math.max(0, gci - gciToCap);
      
      if (postCapGci > 0) {
        const avgCommission = gci / transactions;
        const postCapTransactions = Math.floor(postCapGci / avgCommission);
        const postCapFees = postCapTransactions * 285; // $285 per transaction
        
        // Check if $6K in post-cap fees achieved
        if (postCapFees >= 6000) {
          eliteAgent = true;
          eliteAward = 16000;
        }
      }
    }
    
    // Path 2: High GCI alternative ($500K+ GCI, 10+ transactions)
    if (!eliteAgent && gci >= 500000 && transactions >= 10) {
      eliteAgent = true;
      eliteAward = 16000;
    }
    
    // 4. CULTURAL CONTRIBUTION AWARD - Additional $8K for Elite agents
    if (eliteAgent) {
      culturalAward = 8000; // Available for teaching at Real Academy
    }
    
    // 5. AGENT RECRUITMENT AWARDS - $500-$2000 per qualified recruit
    if (recruits > 0) {
      recruitmentAwards = recruits * 1000; // Average $1K per recruit (varies by production)
    }
    
    // Calculate total stock awards
    totalStockAwards = cappingAward + sppBonusShares + eliteAward + culturalAward + recruitmentAwards;
    
    return {
      totalStockAwards,
      breakdown: {
        cappingAward,
        sppBonusShares: Math.round(sppBonusShares),
        eliteAward,
        culturalAward,
        recruitmentAwards
      },
      eliteAgent,
      eliteTransactionFee: eliteAgent ? 129 : 285,
      agentCaps
    };
  };

  // Real Brokerage specific calculations with correct fee structure
  const calculateRealEarnings = () => {
    // Constants based on official Real Brokerage documentation
    const COMMISSION_SPLIT = 0.85
    const ANNUAL_CAP = 12000
    const BEOP_FEE = 30
    const ANNUAL_FEE = 750
    const POST_CAP_TRANSACTION_FEE = 285
    const ELITE_TRANSACTION_FEE = 129
    
    // Calculate comprehensive stock awards
    const stockAwardData = calculateRealStockAwards(gci, transactions, sppParticipation, recruits);
    const isEliteAgent = stockAwardData.eliteAgent;
    
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
      
      // Apply correct transaction fees - use Elite fee if qualified
      const transactionFee = isEliteAgent ? ELITE_TRANSACTION_FEE : POST_CAP_TRANSACTION_FEE
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
    
    const totalAnnualIncome = netIncome + revenueShare + stockAwardData.totalStockAwards
    
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
      stockAwards: stockAwardData.totalStockAwards,
      stockBreakdown: stockAwardData.breakdown,
      eliteAgent: stockAwardData.eliteAgent,
      eliteTransactionFee: stockAwardData.eliteTransactionFee,
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
              id="sppParticipation"
              checked={sppParticipation}
              onChange={(e) => setSppParticipation(e.target.checked)}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-slate-300 rounded"
            />
            <label htmlFor="sppParticipation" className="ml-2 block text-sm text-slate-700">
              Participate in Stock Purchase Plan (SPP)
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
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Stock Awards</span>
                    <span className="text-lg font-semibold text-green-600">+${results.stockAwards.toLocaleString()}</span>
                  </div>
                  <div className="ml-4 mt-1 space-y-1 text-sm text-slate-500">
                    {results.stockBreakdown.cappingAward > 0 && (
                      <div className="flex justify-between">
                        <span>├── Capping Award</span>
                        <span>${results.stockBreakdown.cappingAward.toLocaleString()}</span>
                      </div>
                    )}
                    {results.stockBreakdown.sppBonusShares > 0 && (
                      <div className="flex justify-between">
                        <span>├── SPP Bonus Shares</span>
                        <span>${results.stockBreakdown.sppBonusShares.toLocaleString()}</span>
                      </div>
                    )}
                    {results.stockBreakdown.eliteAward > 0 && (
                      <div className="flex justify-between">
                        <span>├── Elite Agent Award</span>
                        <span>${results.stockBreakdown.eliteAward.toLocaleString()}</span>
                      </div>
                    )}
                    {results.stockBreakdown.culturalAward > 0 && (
                      <div className="flex justify-between">
                        <span>├── Cultural Award</span>
                        <span>${results.stockBreakdown.culturalAward.toLocaleString()}</span>
                      </div>
                    )}
                    {results.stockBreakdown.recruitmentAwards > 0 && (
                      <div className="flex justify-between">
                        <span>└── Recruitment Awards</span>
                        <span>${results.stockBreakdown.recruitmentAwards.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
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
                <p className="mt-1">After capping: 100% commission retention with ${results.eliteTransactionFee} transaction fee per deal</p>
              )}
              {results.eliteAgent && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 font-semibold">🏆 Elite Agent Status Achieved!</p>
                  <p className="text-green-700 text-xs mt-1">
                    • $16,000 Elite Agent Award (3-year vesting)
                  </p>
                  <p className="text-green-700 text-xs">
                    • Reduced transaction fee: $129 vs $285
                  </p>
                  <p className="text-green-700 text-xs">
                    • Eligible for $8,000 cultural award
                  </p>
                </div>
              )}
              {results.stockAwards > 0 && !results.eliteAgent && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-800 font-semibold">💰 Stock Awards Earned!</p>
                  <p className="text-blue-700 text-xs mt-1">
                    • Capping and/or SPP bonus shares earned
                  </p>
                  <p className="text-blue-700 text-xs">
                    • Continue growing to qualify for Elite status
                  </p>
                </div>
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
