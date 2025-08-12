'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrokerageCompassIcon } from '../../components/Logo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  trackCalculatorUsage, 
  trackBrokerageComparison, 
  trackPDFDownload, 
  trackShareAction, 
  trackPageView, 
  trackConversionEvent,
  trackCalculatorScenario,
  trackFormInteraction
} from '../../utils/analytics';
import { 
  CalculatorButton, 
  NavigationButton 
} from '../../components/TrackedButton';

interface BrokerageData {
  name: string;
  logo: string;
  agentSplit: number;
  brokerageSplit: number;
  cap: number;
  fees: {
    startup?: number;
    annual?: number;
    monthly?: number;
    perTransaction?: number;
    percentageOfSale?: number;
    maxPerTransaction?: number;
    franchiseFee?: number; // Percentage of GCI for traditional brokerages
  };
  revenueShare: {
    tier1Percentage: number;
    tier2Percentage?: number;
    tier3Percentage?: number;
    maxPerAgent?: number;
    description: string;
    multiTierDescription?: string;
  };
  stockAwards: {
    maxAnnual: number;
    description: string;
    tradeable: boolean;
  };
  color: string;
}

interface CurrentBrokerageData {
  commissionSplit: string;
  annualCap: number;
  monthlyFees: number;
  transactionFees: number;
  annualFees: number;
  royaltyFees: number;
  otherMonthlyCosts: number;
}

interface CalculationResult {
  brokerage: BrokerageData;
  grossCommission: number;
  brokerageCommission: number;
  agentCommission: number;
  annualFees: number;
  transactionFees: number;
  totalFees: number;
  capReached: boolean;
  capMonth: number;
  postCapIncome: number;
  netIncome: number;
  revenueShareIncome: number;
  stockAwardIncome: number;
  totalAnnualIncome: number;
  monthlyBreakdown: {
    preCapMonthly: number;
    postCapMonthly: number;
    preCapMonths: number;
    postCapMonths: number;
  };
  // New fields for comparison
  differenceFromCurrent: number;
  percentageImprovement: number;
  isCurrentBrokerage: boolean;
}

interface Scenario {
  name: string;
  description: string;
  gci: string;
  transactions: string;
  recruits: string;
  recruitGci: string;
  recruitingGoal: string;
}

const scenarios: Scenario[] = [
  {
    name: "New Agent",
    description: "Just starting out",
    gci: "40000",
    transactions: "10", 
    recruits: "0",
    recruitGci: "50000",
    recruitingGoal: "1-2 agents"
  },
  {
    name: "Experienced Agent", 
    description: "Established production",
    gci: "80000",
    transactions: "20",
    recruits: "2", 
    recruitGci: "60000",
    recruitingGoal: "3-5 agents"
  },
  {
    name: "Team Leader",
    description: "Growing team",
    gci: "150000", 
    transactions: "35",
    recruits: "6",
    recruitGci: "70000",
    recruitingGoal: "6+ agents"
  },
  {
    name: "Top Producer",
    description: "High volume business",
    gci: "300000",
    transactions: "60", 
    recruits: "10",
    recruitGci: "80000",
    recruitingGoal: "6+ agents"
  }
];

const cloudBrokerages: BrokerageData[] = [
  {
    name: 'Real Brokerage',
    logo: '/logos/real-brokerage-logo.png',
    agentSplit: 85,
    brokerageSplit: 15,
    cap: 12000,
    fees: {
      startup: 249,
      annual: 750,
      perTransaction: 30
    },
    revenueShare: {
      tier1Percentage: 5,
      tier2Percentage: 4,
      tier3Percentage: 3,
      maxPerAgent: 4000,
      description: '5% of brokerage split, max $4K per agent',
      multiTierDescription: 'Multi-tier system with higher recruiting levels'
    },
    stockAwards: {
      maxAnnual: 24000,
      description: 'Elite Agent Award up to $24K annually',
      tradeable: true
    },
    color: 'bg-slate-600'
  },
  {
    name: 'eXp Realty',
    logo: '/logos/exp-realty-logo.png',
    agentSplit: 80,
    brokerageSplit: 20,
    cap: 16000,
    fees: {
      startup: 149,
      monthly: 85,
      perTransaction: 25
    },
    revenueShare: {
      tier1Percentage: 3.5,
      description: '3.5% of recruited agent revenue until they cap',
      multiTierDescription: '7-tier system with exponential growth potential'
    },
    stockAwards: {
      maxAnnual: 16000,
      description: 'ICON Agent Award up to $16K annually',
      tradeable: true
    },
    color: 'bg-green-600'
  },
  {
    name: 'Epique Realty',
    logo: '/logos/epique-realty-logo.png',
    agentSplit: 85,
    brokerageSplit: 15,
    cap: 15000,
    fees: {
      startup: 99,
      monthly: 99,
      perTransaction: 0,
      percentageOfSale: 0.001,
      maxPerTransaction: 500
    },
    revenueShare: {
      tier1Percentage: 10,
      maxPerAgent: 500,
      description: '10% of company commission, max $500 per agent',
      multiTierDescription: 'Linear scaling with recruiting volume'
    },
    stockAwards: {
      maxAnnual: 15000,
      description: 'Power Agent Award up to $15K annually',
      tradeable: true
    },
    color: 'bg-purple-600'
  },
  {
    name: 'LPT Realty',
    logo: '/logos/lpt-realty-logo.png',
    agentSplit: 80,
    brokerageSplit: 20,
    cap: 15000,
    fees: {
      perTransaction: 195
    },
    revenueShare: {
      tier1Percentage: 0,
      description: 'Estimated $400 per recruited agent',
      multiTierDescription: 'Revenue share scales with production level'
    },
    stockAwards: {
      maxAnnual: 5000,
      description: 'Gold/Black Badge awards (private company)',
      tradeable: false
    },
    color: 'bg-orange-600'
  }
];

// Traditional brokerages
const traditionalBrokerages: BrokerageData[] = [
  {
    name: 'RE/MAX',
    logo: '/logos/remax-logo.png',
    agentSplit: 95,
    brokerageSplit: 5,
    cap: 0, // No cap on brokerage split
    fees: {
      monthly: 2500, // High desk fees
      perTransaction: 150,
      annual: 500,
      franchiseFee: 6 // 6% of GCI
    },
    revenueShare: {
      tier1Percentage: 0,
      description: 'No revenue share program',
      multiTierDescription: 'Traditional franchise model'
    },
    stockAwards: {
      maxAnnual: 0,
      description: 'No stock awards',
      tradeable: false
    },
    color: 'bg-cyan-500'
  },
  {
    name: 'Keller Williams',
    logo: '/logos/keller-williams-logo.png',
    agentSplit: 70,
    brokerageSplit: 30,
    cap: 24000,
    fees: {
      monthly: 1000,
      franchiseFee: 6 // 6% of GCI
    },
    revenueShare: {
      tier1Percentage: 0,
      description: 'Profit sharing program available',
      multiTierDescription: 'Traditional franchise with profit sharing'
    },
    stockAwards: {
      maxAnnual: 0,
      description: 'No stock awards',
      tradeable: false
    },
    color: 'bg-yellow-600'
  },
  {
    name: 'Coldwell Banker',
    logo: '/logos/coldwell-banker-logo.png',
    agentSplit: 70,
    brokerageSplit: 30,
    cap: 20000,
    fees: {
      monthly: 1000,
      perTransaction: 250,
      franchiseFee: 6 // 6% of GCI
    },
    revenueShare: {
      tier1Percentage: 0,
      description: 'No revenue share program',
      multiTierDescription: 'Traditional franchise model'
    },
    stockAwards: {
      maxAnnual: 0,
      description: 'No stock awards',
      tradeable: false
    },
    color: 'bg-blue-800'
  },
  {
    name: 'Century 21',
    logo: '/logos/century21-logo.png',
    agentSplit: 75,
    brokerageSplit: 25,
    cap: 18000,
    fees: {
      monthly: 800,
      perTransaction: 200,
      franchiseFee: 6 // 6% of GCI
    },
    revenueShare: {
      tier1Percentage: 0,
      description: 'No revenue share program',
      multiTierDescription: 'Traditional franchise model'
    },
    stockAwards: {
      maxAnnual: 0,
      description: 'No stock awards',
      tradeable: false
    },
    color: 'bg-orange-800'
  }
];

export default function Calculator() {
  const [gci, setGci] = useState<string>('');
  const [transactions, setTransactions] = useState<string>('');
  const [recruits, setRecruits] = useState<string>('');
  const [recruitGci, setRecruitGci] = useState<string>('');
  const [recruitTransactions, setRecruitTransactions] = useState<string>('');
  const [recruitingGoal, setRecruitingGoal] = useState<string>('1-2 agents');
  const [isHighProducer, setIsHighProducer] = useState<boolean>(false);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showCapTimeline, setShowCapTimeline] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Track calculator page view
  useEffect(() => {
    trackPageView('calculator', {
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    trackConversionEvent('calculator_page_viewed');
  }, []);
  
  // New transaction fee states
  const [customTransactionFees, setCustomTransactionFees] = useState<boolean>(false);
  const [customPerTransactionFee, setCustomPerTransactionFee] = useState<string>('');
  const [avgSalePrice, setAvgSalePrice] = useState<string>('');
  const [showFeeBreakdown, setShowFeeBreakdown] = useState<boolean>(false);

  // Current brokerage comparison states
  const [showCurrentBrokerage, setShowCurrentBrokerage] = useState<boolean>(false);
  const [currentCommissionSplit, setCurrentCommissionSplit] = useState<string>('70/30');
  const [currentAnnualCap, setCurrentAnnualCap] = useState<string>('');
  const [currentMonthlyFees, setCurrentMonthlyFees] = useState<string>('');
  const [currentTransactionFees, setCurrentTransactionFees] = useState<string>('');
  const [currentAnnualFees, setCurrentAnnualFees] = useState<string>('');
  const [currentRoyaltyFees, setCurrentRoyaltyFees] = useState<string>('');
  const [currentOtherMonthlyCosts, setCurrentOtherMonthlyCosts] = useState<string>('');
  const [showAdvancedCurrent, setShowAdvancedCurrent] = useState<boolean>(false);
  
  // Toggle state for cloud vs traditional brokerages
  const [showTraditional, setShowTraditional] = useState<boolean>(false);
  
  // Save/Share functionality states
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [showCopySuccess, setShowCopySuccess] = useState<boolean>(false);
  
  // PDF export states
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [showPDFSuccess, setShowPDFSuccess] = useState<boolean>(false);
  const [showPDFError, setShowPDFError] = useState<boolean>(false);
  
  // Branding configuration states
  const [brandingConfig, setBrandingConfig] = useState({
    logo: null as string | null,
    agentName: 'BrokerageCompass',
    phone: '',
    email: '',
    website: '',
    primaryColor: '#475569',
    tagline: 'Navigate Your Real Estate Career'
  });
  const [showBrandingModal, setShowBrandingModal] = useState<boolean>(false);
  const [showBrandingSaveSuccess, setShowBrandingSaveSuccess] = useState<boolean>(false);

  const avgCommission = gci && transactions ? 
    (parseFloat(gci) / parseFloat(transactions)).toFixed(0) : '0';

  // Save/Share functionality
  const generateCalculationData = () => {
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      inputs: {
        gci: gci,
        transactions: transactions,
        recruits: recruits,
        recruitGci: recruitGci,
        recruitTransactions: recruitTransactions,
        recruitingGoal: recruitingGoal,
        isHighProducer: isHighProducer,
        customTransactionFees: customTransactionFees,
        customPerTransactionFee: customPerTransactionFee,
        avgSalePrice: avgSalePrice,
        currentBrokerage: showCurrentBrokerage ? {
          enabled: showCurrentBrokerage,
          split: currentCommissionSplit,
          cap: currentAnnualCap,
          monthlyFees: currentMonthlyFees,
          transactionFees: currentTransactionFees,
          annualFees: currentAnnualFees,
          royaltyFees: currentRoyaltyFees,
          otherMonthlyCosts: currentOtherMonthlyCosts
        } : null,
        showTraditional: showTraditional,
        branding: brandingConfig
      },
      results: results
    };
  };

  const generateShareableURL = (calculationData: any) => {
    try {
      // Only encode the inputs for URL sharing (results will be recalculated)
      const encodedData = btoa(JSON.stringify(calculationData.inputs));
      const shareUrl = `${window.location.origin}/calculator?data=${encodedData}`;
      return shareUrl;
    } catch (error) {
      console.error('Failed to generate shareable URL:', error);
      return window.location.href;
    }
  };

  const saveCalculation = () => {
    if (!gci || parseFloat(gci) <= 0) {
      return;
    }

    const calculationData = generateCalculationData();
    const newCalculation = {
      ...calculationData,
      name: `Calculation ${savedCalculations.length + 1}`,
      gciFormatted: formatCurrency(parseFloat(gci)),
      transactionsCount: transactions || 0
    };
    
    setSavedCalculations(prev => [...prev, newCalculation]);
    
    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleShareCalculation = () => {
    if (!gci || parseFloat(gci) <= 0) {
      return;
    }

    const calculationData = generateCalculationData();
    const url = generateShareableURL(calculationData);
    setShareUrl(url);
    setShowShareModal(true);
    
    // Track share action
    const bestResult = results.find(r => !r.isCurrentBrokerage) || results[0];
    if (bestResult && gci) {
      trackShareAction('link', {
        gci: parseFloat(gci),
        bestBrokerage: bestResult.brokerage.name,
        savingsAmount: bestResult.differenceFromCurrent
      });
    }
    
    // Track conversion event
    trackConversionEvent('share_modal_opened', {
      gci: parseFloat(gci) || 0,
      results_count: results.length
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
      
      // Track copy action
      trackConversionEvent('share_link_copied', {
        gci: parseFloat(gci) || 0,
        method: 'clipboard_api'
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
      
      // Track copy action
      trackConversionEvent('share_link_copied', {
        gci: parseFloat(gci) || 0,
        method: 'fallback'
      });
    }
  };

  const loadCalculationFromURL = () => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        
        // Set all form inputs from decoded data
        setGci(decodedData.gci || '');
        setTransactions(decodedData.transactions || '');
        setRecruits(decodedData.recruits || '');
        setRecruitGci(decodedData.recruitGci || '');
        setRecruitTransactions(decodedData.recruitTransactions || '');
        setRecruitingGoal(decodedData.recruitingGoal || '1-2 agents');
        setIsHighProducer(decodedData.isHighProducer || false);
        setCustomTransactionFees(decodedData.customTransactionFees || false);
        setCustomPerTransactionFee(decodedData.customPerTransactionFee || '');
        setAvgSalePrice(decodedData.avgSalePrice || '');
        setShowTraditional(decodedData.showTraditional || false);
        
        // Load current brokerage data if present
        if (decodedData.currentBrokerage) {
          setShowCurrentBrokerage(decodedData.currentBrokerage.enabled || false);
          setCurrentCommissionSplit(decodedData.currentBrokerage.split || '70/30');
          setCurrentAnnualCap(decodedData.currentBrokerage.cap || '');
          setCurrentMonthlyFees(decodedData.currentBrokerage.monthlyFees || '');
          setCurrentTransactionFees(decodedData.currentBrokerage.transactionFees || '');
          setCurrentAnnualFees(decodedData.currentBrokerage.annualFees || '');
          setCurrentRoyaltyFees(decodedData.currentBrokerage.royaltyFees || '');
          setCurrentOtherMonthlyCosts(decodedData.currentBrokerage.otherMonthlyCosts || '');
        }
        
        // Load branding configuration if present
        if (decodedData.branding) {
          setBrandingConfig({
            logo: decodedData.branding.logo || null,
            agentName: decodedData.branding.agentName || '',
            phone: decodedData.branding.phone || '',
            email: decodedData.branding.email || '',
            website: decodedData.branding.website || '',
            primaryColor: decodedData.branding.primaryColor || '#475569',
            tagline: decodedData.branding.tagline || ''
          });
        }
        
        // Clear URL parameter after loading
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Failed to load calculation data from URL:', error);
      }
    }
  };

  const createPDFContent = () => {
    const calculationData = generateCalculationData();
    const bestResult = results.length > 0 ? results.reduce((best, current) => 
      current.totalAnnualIncome > best.totalAnnualIncome ? current : best
    ) : null;
    
    const currentBrokerageResult = results.find(r => r.isCurrentBrokerage);
    const cloudResults = results.filter(r => !r.isCurrentBrokerage);
    const maxSavings = cloudResults.length > 0 ? Math.max(...cloudResults.map(r => 
      currentBrokerageResult ? r.totalAnnualIncome - currentBrokerageResult.totalAnnualIncome : r.totalAnnualIncome
    )) : 0;



    return `
      <div style="
        width: 794px;
        min-height: 1123px;
        margin: 0;
        padding: 32px;
        box-sizing: border-box;
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        color: #000000;
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px; border-bottom: 2px solid ${brandingConfig.primaryColor}; padding-bottom: 24px;">
          ${brandingConfig.logo ? `<img src="${brandingConfig.logo}" alt="Logo" style="height: 64px; margin: 0 auto 16px auto; display: block;" />` : `
            <svg width="64" height="64" viewBox="0 0 100 100" style="margin: 0 auto 16px auto; display: block;" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="${brandingConfig.primaryColor}" stroke-width="6"/>
              <circle cx="50" cy="50" r="30" fill="#f8fafc" stroke="#06b6d4" stroke-width="3"/>
              <path d="M50 20 L45 35 L50 30 L55 35 Z" fill="#06b6d4"/>
              <path d="M50 80 L45 65 L50 70 L55 65 Z" fill="${brandingConfig.primaryColor}"/>
              <circle cx="50" cy="50" r="5" fill="${brandingConfig.primaryColor}"/>
            </svg>
          `}
          <h1 style="font-size: 28px; font-weight: bold; color: ${brandingConfig.primaryColor}; margin-bottom: 8px; margin-top: 0;">
            BrokerageCompass Analysis Report
          </h1>
          <p style="color: #6b7280; margin: 8px 0;">
            Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          ${brandingConfig.agentName ? `
            <p style="font-size: 12px; color: #374151; margin: 8px 0; font-weight: 600;">
              Professional analysis by ${brandingConfig.agentName}
            </p>
          ` : `
            <p style="font-size: 12px; color: #9ca3af; margin: 8px 0;">
              Professional analysis by BrokerageCompass
            </p>
          `}
        </div>

        <!-- Agent Information -->
        <div style="margin-bottom: 32px; background-color: #f9fafb; padding: 24px; border-radius: 8px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827; margin-top: 0;">Agent Profile</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            <div style="min-width: 200px;">
              <span style="font-weight: 500; color: #374151;">Annual GCI:</span> 
              <span style="margin-left: 8px; font-weight: bold;">${formatCurrency(parseFloat(gci) || 0)}</span>
            </div>
            <div style="min-width: 200px;">
              <span style="font-weight: 500; color: #374151;">Transactions:</span> 
              <span style="margin-left: 8px; font-weight: bold;">${transactions || 0}</span>
            </div>
            <div style="min-width: 200px;">
              <span style="font-weight: 500; color: #374151;">Recruited Agents:</span> 
              <span style="margin-left: 8px; font-weight: bold;">${recruits || 0}</span>
            </div>
            <div style="min-width: 200px;">
              <span style="font-weight: 500; color: #374151;">High Producer:</span> 
              <span style="margin-left: 8px; font-weight: bold;">${isHighProducer ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        ${currentBrokerageResult ? `
        <!-- Current Situation -->
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827; margin-top: 0;">Current Situation</h2>
          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; border: 1px solid #fecaca;">
            <div style="font-size: 16px; font-weight: 500; color: #991b1b;">
              Current Annual Income: ${formatCurrency(currentBrokerageResult.totalAnnualIncome)}
            </div>
            <p style="font-size: 12px; color: #dc2626; margin: 4px 0 0 0;">
              Based on your current brokerage structure (${currentCommissionSplit} split)
            </p>
          </div>
        </div>
        ` : ''}

        <!-- Brokerage Comparison Table -->
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827; margin-top: 0;">
            ${showTraditional ? 'Traditional' : 'Cloud'} Brokerage Comparison
          </h2>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <thead style="background-color: #f9fafb;">
                <tr>
                  <th style="padding: 12px 16px; text-align: left; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">Brokerage</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">Commission</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">Revenue Share</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">Stock Awards</th>
                  <th style="padding: 12px 16px; text-align: right; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">Total Income</th>
                  ${currentBrokerageResult ? '<th style="padding: 12px 16px; text-align: right; font-weight: 500; color: #111827; border-bottom: 1px solid #e5e7eb;">Difference</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${results
                  .sort((a, b) => b.totalAnnualIncome - a.totalAnnualIncome)
                  .map((result, index) => `
                    <tr style="${index === 0 && !result.isCurrentBrokerage ? 'background-color: #f0fdf4;' : result.isCurrentBrokerage ? 'background-color: #fffbeb;' : ''}">
                      <td style="padding: 12px 16px; ${index < results.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                        <div style="font-weight: 500; color: #111827;">${result.brokerage.name}</div>
                        <div style="font-size: 10px; color: #6b7280;">${result.brokerage.agentSplit}/${result.brokerage.brokerageSplit} split</div>
                      </td>
                      <td style="padding: 12px 16px; text-align: right; font-weight: 500; ${index < results.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                        ${formatCurrency(result.netIncome - result.totalFees)}
                      </td>
                      <td style="padding: 12px 16px; text-align: right; font-weight: 500; ${index < results.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                        ${formatCurrency(result.revenueShareIncome)}
                      </td>
                      <td style="padding: 12px 16px; text-align: right; font-weight: 500; ${index < results.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                        ${formatCurrency(result.stockAwardIncome)}
                      </td>
                      <td style="padding: 12px 16px; text-align: right; font-weight: bold; font-size: 16px; ${index < results.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                        ${formatCurrency(result.totalAnnualIncome)}
                      </td>
                      ${currentBrokerageResult ? `
                        <td style="padding: 12px 16px; text-align: right; font-weight: 500; ${index < results.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                          ${result.isCurrentBrokerage ? 
                            '<span style="color: #6b7280; font-style: italic;">Baseline</span>' : 
                            `<span style="color: ${result.differenceFromCurrent >= 0 ? '#059669' : '#dc2626'};">
                              ${result.differenceFromCurrent >= 0 ? '+' : ''}${formatCurrency(result.differenceFromCurrent)}
                            </span>`
                          }
                        </td>
                      ` : ''}
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 2px solid ${brandingConfig.primaryColor}; padding-top: 24px; text-align: center; font-size: 10px; color: #6b7280;">
          <p style="margin: 0 0 8px 0;">This report is for informational purposes only. Actual results may vary based on individual circumstances.</p>
          ${brandingConfig.agentName || brandingConfig.phone || brandingConfig.email ? `
            <div style="margin: 16px 0; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
              ${brandingConfig.agentName ? `<div style="font-weight: 600; color: ${brandingConfig.primaryColor}; margin-bottom: 4px;">${brandingConfig.agentName}</div>` : ''}
              <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; font-size: 11px;">
                ${brandingConfig.phone ? `<span>📞 ${brandingConfig.phone}</span>` : ''}
                ${brandingConfig.email ? `<span>✉️ ${brandingConfig.email}</span>` : ''}
                ${brandingConfig.website ? `<span>🌐 ${brandingConfig.website}</span>` : ''}
              </div>
              ${brandingConfig.tagline ? `<div style="font-style: italic; color: #6b7280; margin-top: 4px; font-size: 10px;">${brandingConfig.tagline}</div>` : ''}
            </div>
          ` : ''}
          <p style="margin: 0;">
            Generated by BrokerageCompass on ${new Date().toLocaleDateString()} | 
            <span style="font-weight: 500;">Contact ${brandingConfig.agentName || 'your recruiting specialist'} for personalized guidance</span>
          </p>
        </div>
      </div>
    `;
  };

  const handleExportPDF = async () => {
    if (!gci || parseFloat(gci) <= 0 || results.length === 0) {
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Create a temporary container for the PDF content
      const tempContainer = document.createElement('div');
      tempContainer.id = 'temp-pdf-container';
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '0';
      tempContainer.style.left = '0';
      tempContainer.style.zIndex = '10000';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.innerHTML = createPDFContent();
      
      // Add to DOM
      document.body.appendChild(tempContainer);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check dimensions
      const rect = tempContainer.getBoundingClientRect();
      console.log('Temp container dimensions:', rect);
      
      if (rect.width === 0 || rect.height === 0) {
        throw new Error(`Temp container has no dimensions: ${rect.width}x${rect.height}`);
      }
      
      // Generate canvas from HTML
      const canvas = await html2canvas(tempContainer, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: tempContainer.scrollHeight
      });
      
      // Remove temporary container
      document.body.removeChild(tempContainer);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions for A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Convert pixels to mm (assuming 96 DPI)
      const imgWidthMM = (imgWidth * 25.4) / 96;
      const imgHeightMM = (imgHeight * 25.4) / 96;
      
      // Scale to fit page with margins
      const margin = 10;
      const availableWidth = pdfWidth - (2 * margin);
      const availableHeight = pdfHeight - (2 * margin);
      
      const scaleX = availableWidth / imgWidthMM;
      const scaleY = availableHeight / imgHeightMM;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
      
      const finalWidth = imgWidthMM * scale;
      const finalHeight = imgHeightMM * scale;
      const x = (pdfWidth - finalWidth) / 2;
      const y = margin;
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      
      // Generate filename with agent GCI for easy identification
      const agentGCI = parseFloat(gci).toLocaleString().replace(/,/g, '');
      const filename = `brokerage-comparison-${agentGCI}-GCI-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save PDF
      pdf.save(filename);
      
      // Track PDF download
      const bestResult = results.find(r => !r.isCurrentBrokerage) || results[0];
      if (bestResult) {
        trackPDFDownload({
          gci: parseFloat(gci),
          bestBrokerage: bestResult.brokerage.name,
          savingsAmount: bestResult.differenceFromCurrent,
          includesRevenueShare: parseFloat(recruits) > 0
        });
      }
      
      // Track conversion event
      trackConversionEvent('pdf_exported', {
        gci: parseFloat(gci),
        filename: filename,
        results_count: results.length
      });
      
      // Show success message
      setShowPDFSuccess(true);
      setTimeout(() => setShowPDFSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setShowPDFError(true);
      setTimeout(() => setShowPDFError(false), 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const loadScenario = (scenario: Scenario) => {
    // Track scenario selection
    trackConversionEvent('scenario_selected', {
      scenario_name: scenario.name,
      gci: parseFloat(scenario.gci),
      transactions: parseFloat(scenario.transactions),
      recruits: parseFloat(scenario.recruits)
    });
    
    setGci(scenario.gci);
    setTransactions(scenario.transactions);
    setRecruits(scenario.recruits);
    setRecruitGci(scenario.recruitGci);
    setRecruitingGoal(scenario.recruitingGoal);
    setIsHighProducer(parseFloat(scenario.gci) >= 500000 || parseFloat(scenario.transactions) >= 20);
  };

  const calculateEnhancedRevenueShare = (brokerage: BrokerageData, numRecruits: number, recruitAvgGci: number, goal: string) => {
    if (numRecruits <= 0 || recruitAvgGci <= 0) return 0;

    const goalRecruits = goal === '6+ agents' ? 6 : goal === '3-5 agents' ? 3 : numRecruits;
    const effectiveRecruits = Math.max(numRecruits, goalRecruits);

    switch (brokerage.name) {
      case 'Real Brokerage':
        const realBrokerageShare = recruitAvgGci * 0.15;
        let realTotal = 0;
        
        const tier1Count = Math.min(effectiveRecruits, 5);
        const tier1Revenue = Math.min(realBrokerageShare * 0.05, 4000);
        realTotal += tier1Revenue * tier1Count;
        
        if (effectiveRecruits > 5) {
          const tier2Count = Math.min(effectiveRecruits - 5, 5);
          const tier2Revenue = Math.min(realBrokerageShare * 0.04, 3000);
          realTotal += tier2Revenue * tier2Count;
        }
        
        if (effectiveRecruits > 10) {
          const tier3Count = effectiveRecruits - 10;
          const tier3Revenue = Math.min(realBrokerageShare * 0.03, 2000);
          realTotal += tier3Revenue * tier3Count;
        }
        
        return realTotal;

      case 'eXp Realty':
        const expBrokerageShare = recruitAvgGci * 0.20;
        const expRevenueShare = expBrokerageShare * 0.035;
        const expMultiplier = effectiveRecruits >= 6 ? 1.5 : 1;
        return expRevenueShare * numRecruits * expMultiplier;

      case 'Epique Realty':
        const epiqueBrokerageShare = recruitAvgGci * 0.15;
        const epiqueRevenueShare = epiqueBrokerageShare * 0.10;
        const cappedEpiqueRevenue = Math.min(epiqueRevenueShare, 500);
        return cappedEpiqueRevenue * numRecruits;

      case 'LPT Realty':
        const baseRate = effectiveRecruits >= 6 ? 450 : 400;
        return baseRate * numRecruits;

      default:
        return 0;
    }
  };

  const calculateStockAwards = (brokerage: BrokerageData, grossCommission: number, numTransactions: number, isHighProd: boolean, numRecruits: number) => {
    switch (brokerage.name) {
      case 'Real Brokerage':
        return calculateRealStockAwards(grossCommission, numTransactions, isHighProd, numRecruits);
      
      case 'eXp Realty':
        return calculateExpStockAwards(grossCommission, numTransactions, isHighProd);
      
      case 'Epique Realty':
        return calculateEpiqueStockAwards(grossCommission, numTransactions, isHighProd);
      
      case 'LPT Realty':
        return calculateLPTStockAwards(grossCommission, numTransactions, isHighProd);
      
      default:
        return 0;
    }
  };

  const calculateRealStockAwards = (GCI: number, transactions: number, isHighProducer: boolean, numRecruits: number) => {
    let stockAwards = 0;
    
    // Elite Agent Award: Up to $24,000
    const isRecruiting = numRecruits > 0;
    if (isHighProducer && isRecruiting && GCI >= 500000) {
      stockAwards = 24000;
    } else if (isHighProducer && transactions >= 20) {
      stockAwards = 16000; // Partial award
    }
    
    return stockAwards;
  };

  const calculateExpStockAwards = (GCI: number, transactions: number, isHighProducer: boolean) => {
    let stockAwards = 0;
    
    // ICON Agent Award: Up to $16,000
    const hitsICONRequirements = 
      isHighProducer && 
      (transactions >= 20 || GCI >= 500000) &&
      transactions >= 10; // Minimum transaction requirement
      
    if (hitsICONRequirements) {
      stockAwards = 16000;
    }
    
    // Basic stock awards for capping
    if (GCI >= 80000) { // Assuming they cap
      stockAwards += 400; // Annual capping bonus
    }
    
    return stockAwards;
  };

  const calculateEpiqueStockAwards = (GCI: number, transactions: number, isHighProducer: boolean) => {
    let stockAwards = 0;
    
    // Power Agent Award: Up to $15,000
    if (isHighProducer && (transactions >= 24 || GCI >= 1000000)) {
      stockAwards = 15000;
    } else if (transactions >= 15) {
      stockAwards = 7500; // Partial award
    }
    
    return stockAwards;
  };

  const calculateLPTStockAwards = (GCI: number, transactions: number, isHighProducer: boolean) => {
    let stockAwards = 0;
    
    // Gold Badge: 15 homes annually
    if (transactions >= 15) {
      stockAwards = 2000; // Estimated value (not publicly traded)
    }
    
    // Black Badge: 35 homes annually  
    if (transactions >= 35) {
      stockAwards = 5000; // Estimated value (not publicly traded)
    }
    
    // Note: LPT is not publicly traded, so stock value is theoretical
    return stockAwards;
  };

  const calculateCapTimeline = (grossCommission: number, brokerageSplit: number, cap: number) => {
    const monthlyGCI = grossCommission / 12;
    const monthlyBrokerageShare = monthlyGCI * (brokerageSplit / 100);
    
    if (monthlyBrokerageShare <= 0) return { capMonth: 12, preCapMonths: 12, postCapMonths: 0 };
    
    const capMonth = Math.ceil(cap / monthlyBrokerageShare);
    const preCapMonths = Math.min(capMonth, 12);
    const postCapMonths = Math.max(0, 12 - preCapMonths);
    
    return { capMonth, preCapMonths, postCapMonths };
  };

  const calculateCurrentBrokerageIncome = () => {
    const grossCommission = parseFloat(gci) || 0;
    const numTransactions = parseFloat(transactions) || 0;
    
    if (grossCommission <= 0) return null;
    
    console.log("=== CURRENT BROKERAGE CALCULATION DEBUG ===");
    console.log("Input GCI:", grossCommission);
    
    // Parse commission split (e.g., "70/30" -> 70% agent, 30% brokerage)
    const splitParts = currentCommissionSplit.split('/');
    const agentSplitPercent = parseFloat(splitParts[0]) || 70;
    const brokerageSplitPercent = parseFloat(splitParts[1]) || 30;
    
    console.log("Current Split Percentage:", currentCommissionSplit);
    console.log("Agent Split Percent:", agentSplitPercent);
    console.log("Brokerage Split Percent:", brokerageSplitPercent);
    
    // Handle flat fee scenario
    const isFlatFee = currentCommissionSplit === "100% (flat fee)";
    
    const annualCap = parseFloat(currentAnnualCap) || 0;
    const monthlyFees = parseFloat(currentMonthlyFees) || 0;
    const transactionFees = parseFloat(currentTransactionFees) || 0;
    const annualFees = parseFloat(currentAnnualFees) || 0;
    const royaltyFees = parseFloat(currentRoyaltyFees) || 0;
    const otherMonthlyCosts = parseFloat(currentOtherMonthlyCosts) || 0;
    
    console.log("Current Cap:", annualCap);
    console.log("Current Monthly Fees:", monthlyFees);
    console.log("Current Transaction Fees:", transactionFees);
    console.log("Current Annual Fees:", annualFees);
    console.log("Number of Transactions:", numTransactions);
    
    let agentCommission: number;
    let brokerageCommission: number;
    let capReached = false;
    let capMonth = 12;
    
    // Calculate step by step
    const agentKeepsPercentage = agentSplitPercent / 100; // e.g. 70% = 0.7
    const brokerageGetsPercentage = brokerageSplitPercent / 100; // e.g. 30% = 0.3

    console.log("Agent keeps percentage:", agentKeepsPercentage);
    console.log("Brokerage gets percentage:", brokerageGetsPercentage);
    
    if (isFlatFee) {
      // For flat fee, agent keeps everything minus the flat fee
      agentCommission = grossCommission;
      brokerageCommission = 0;
      console.log("Flat fee scenario - agent keeps all GCI");
    } else {
      brokerageCommission = grossCommission * brokerageGetsPercentage;
      
      console.log("Brokerage payment calculation:", grossCommission, "*", brokerageGetsPercentage, "=", brokerageCommission);
      
      if (annualCap > 0 && brokerageCommission >= annualCap) {
        capReached = true;
        const timeline = calculateCapTimeline(grossCommission, brokerageSplitPercent, annualCap);
        capMonth = timeline.capMonth;
        brokerageCommission = annualCap;
        agentCommission = grossCommission - annualCap;
        console.log("Cap reached! Brokerage payment capped at:", annualCap);
        console.log("Agent commission after cap:", agentCommission);
      } else {
        agentCommission = grossCommission * agentKeepsPercentage;
        console.log("No cap reached. Agent commission:", agentCommission);
      }
      
      console.log("Brokerage payment (with cap):", brokerageCommission);
    }
    
    // Calculate fees
    const totalTransactionFees = transactionFees * numTransactions;
    const totalMonthlyFees = (monthlyFees + otherMonthlyCosts) * 12;
    const totalRoyaltyFees = royaltyFees > 0 ? (grossCommission * royaltyFees) / 100 : 0;
    const totalFees = totalTransactionFees + totalMonthlyFees + annualFees + totalRoyaltyFees;
    
    console.log("Monthly fees total:", totalMonthlyFees);
    console.log("Transaction fees total:", totalTransactionFees);
    console.log("Annual fees:", annualFees);
    console.log("Royalty fees:", totalRoyaltyFees);
    console.log("Total fees:", totalFees);
    
    const netIncome = agentCommission - totalFees;
    console.log("Final calculation: agentCommission", agentCommission, "- totalFees", totalFees, "=", netIncome);
    console.log("=== END DEBUG ===");
    
    // No revenue share or stock awards for current brokerage
    const totalAnnualIncome = netIncome;
    
    const monthlyGCI = grossCommission / 12;
    const monthlyFeesTotal = totalFees / 12;
    const preCapMonthly = (monthlyGCI * (agentSplitPercent / 100)) - monthlyFeesTotal;
    const postCapMonthly = monthlyGCI - monthlyFeesTotal;
    
    return {
      grossCommission,
      brokerageCommission: capReached ? annualCap : brokerageCommission,
      agentCommission: capReached ? grossCommission - annualCap : agentCommission,
      annualFees: annualFees + totalRoyaltyFees,
      transactionFees: totalTransactionFees,
      totalFees,
      capReached,
      capMonth,
      postCapIncome: capReached ? grossCommission - (annualCap / (brokerageSplitPercent / 100)) : 0,
      netIncome,
      revenueShareIncome: 0,
      stockAwardIncome: 0,
      totalAnnualIncome,
      monthlyBreakdown: {
        preCapMonthly,
        postCapMonthly,
        preCapMonths: capReached ? Math.min(capMonth, 12) : 12,
        postCapMonths: capReached ? Math.max(0, 12 - capMonth) : 0
      },
      differenceFromCurrent: 0,
      percentageImprovement: 0,
      isCurrentBrokerage: true
    };
  };

  const calculateResults = () => {
    const grossCommission = parseFloat(gci) || 0;
    const numTransactions = parseFloat(transactions) || 0;
    const numRecruits = parseFloat(recruits) || 0;
    const recruitAvgGci = parseFloat(recruitGci) || 0;
    const calculatedAvgSalePrice = grossCommission && numTransactions ? grossCommission / numTransactions * 20 : 0;
    const userAvgSalePrice = parseFloat(avgSalePrice) || calculatedAvgSalePrice;

    if (grossCommission <= 0) {
      setResults([]);
      return;
    }

    // Track calculator usage
    trackCalculatorUsage({
      gci: grossCommission,
      transactions: numTransactions,
      currentBrokerage: showCurrentBrokerage ? 'Custom Current Brokerage' : 'Not Specified',
      recruitedAgents: numRecruits
    });

    // Track calculator scenario
    const scenarioType = grossCommission >= 300000 ? 'high_producer' : 
                        grossCommission >= 150000 ? 'high_volume' : 
                        grossCommission >= 80000 ? 'mid_volume' : 'low_volume';

    setIsCalculating(true);
    
    // Calculate current brokerage if enabled
    const currentBrokerageResult = showCurrentBrokerage ? calculateCurrentBrokerageIncome() : null;
    
    // Get the appropriate brokerage set based on toggle
    const displayedBrokerages = showTraditional ? traditionalBrokerages : cloudBrokerages;
    
    // If traditional brokerages is empty, show empty results
    if (showTraditional && traditionalBrokerages.length === 0) {
      setResults([]);
      setIsCalculating(false);
      return;
    }
      
      const calculations = displayedBrokerages.map(brokerage => {
        console.log(`\n=== ${brokerage.name.toUpperCase()} CALCULATION DEBUG ===`);
        console.log("Input GCI:", grossCommission);
        console.log("Number of Transactions:", numTransactions);
        console.log("Brokerage Split:", brokerage.brokerageSplit, "%");
        console.log("Agent Split:", brokerage.agentSplit, "%");
        console.log("Cap:", brokerage.cap);
        
        const brokerageCommission = (grossCommission * brokerage.brokerageSplit) / 100;
        const agentCommission = (grossCommission * brokerage.agentSplit) / 100;
        
        console.log("Brokerage commission calculation:", grossCommission, "*", brokerage.brokerageSplit / 100, "=", brokerageCommission);
        
        const capReached = brokerageCommission >= brokerage.cap;
        const timeline = calculateCapTimeline(grossCommission, brokerage.brokerageSplit, brokerage.cap);
        
        console.log("Cap reached?", capReached, "(", brokerageCommission, ">=", brokerage.cap, ")");
        
        let annualFees = 0;
        let transactionFees = 0;
        
        console.log("\n--- FEE BREAKDOWN ---");
        if (brokerage.fees.startup) {
          annualFees += brokerage.fees.startup;
          console.log("Startup fee:", brokerage.fees.startup);
        }
        if (brokerage.fees.annual) {
          annualFees += brokerage.fees.annual;
          console.log("Annual fee:", brokerage.fees.annual);
        }
        if (brokerage.fees.monthly) {
          const monthlyFeeTotal = brokerage.fees.monthly * 12;
          annualFees += monthlyFeeTotal;
          console.log("Monthly fee:", brokerage.fees.monthly, "x 12 =", monthlyFeeTotal);
        }
        if (brokerage.fees.franchiseFee) {
          const franchiseFeeTotal = grossCommission * (brokerage.fees.franchiseFee / 100);
          annualFees += franchiseFeeTotal;
          console.log("Franchise fee:", brokerage.fees.franchiseFee + "%", "of", grossCommission, "=", franchiseFeeTotal);
        }
        
        // Enhanced transaction fee calculation with custom fees option
        if (customTransactionFees && parseFloat(customPerTransactionFee) > 0) {
          // Use custom per-transaction fee for all brokerages
          const customFeeTotal = parseFloat(customPerTransactionFee) * numTransactions;
          transactionFees += customFeeTotal;
          console.log("Custom transaction fee:", parseFloat(customPerTransactionFee), "x", numTransactions, "=", customFeeTotal);
        } else {
          // Use brokerage-specific fees
          if (brokerage.fees.perTransaction && numTransactions > 0) {
            const perTransactionTotal = brokerage.fees.perTransaction * numTransactions;
            transactionFees += perTransactionTotal;
            console.log("Per-transaction fee:", brokerage.fees.perTransaction, "x", numTransactions, "=", perTransactionTotal);
          }
          
          if (brokerage.fees.percentageOfSale && numTransactions > 0 && userAvgSalePrice > 0) {
            const percentageFee = Math.min(
              userAvgSalePrice * brokerage.fees.percentageOfSale,
              brokerage.fees.maxPerTransaction || Infinity
            );
            const percentageFeeTotal = percentageFee * numTransactions;
            transactionFees += percentageFeeTotal;
            console.log("Percentage-based fee:", userAvgSalePrice, "x", brokerage.fees.percentageOfSale, "= $", percentageFee.toFixed(2), "per transaction");
            console.log("Total percentage fees:", percentageFee.toFixed(2), "x", numTransactions, "=", percentageFeeTotal.toFixed(2));
          }
        }
        
        // Special case: eXp Realty risk management fee
        if (brokerage.name === 'eXp Realty' && numTransactions > 0) {
          const riskManagementFee = Math.min(40 * numTransactions, 500);
          annualFees += riskManagementFee;
          console.log("eXp Risk management fee:", "40 x", numTransactions, "= $", (40 * numTransactions), "capped at $500 = $", riskManagementFee);
        }
        
        const totalFees = annualFees + transactionFees;
        
        console.log("\n--- FINAL CALCULATIONS ---");
        console.log("Annual fees total:", annualFees);
        console.log("Transaction fees total:", transactionFees);
        console.log("Total fees:", totalFees);
        
        let netIncome: number;
        let postCapIncome = 0;
        
        if (capReached) {
          const commissionAtCap = brokerage.cap / (brokerage.brokerageSplit / 100);
          postCapIncome = grossCommission - commissionAtCap;
          netIncome = grossCommission - brokerage.cap;
          console.log("Cap reached! Brokerage payment capped at:", brokerage.cap);
          console.log("Net income after cap:", grossCommission, "-", brokerage.cap, "=", netIncome);
        } else {
          netIncome = agentCommission;
          console.log("No cap reached. Net income:", netIncome);
        }
        
        const revenueShareIncome = calculateEnhancedRevenueShare(brokerage, numRecruits, recruitAvgGci, recruitingGoal);
        const stockAwardIncome = calculateStockAwards(brokerage, grossCommission, numTransactions, isHighProducer, numRecruits);
        
        console.log("Revenue share income:", revenueShareIncome);
        console.log("Stock award income:", stockAwardIncome);
        
        const monthlyGCI = grossCommission / 12;
        const monthlyFees = totalFees / 12;
        const preCapMonthly = (monthlyGCI * (brokerage.agentSplit / 100)) - monthlyFees;
        const postCapMonthly = monthlyGCI - monthlyFees;
        
        const totalAnnualIncome = netIncome - totalFees + revenueShareIncome + stockAwardIncome;
        
        console.log("Final calculation: netIncome", netIncome, "- totalFees", totalFees, "+ revenueShare", revenueShareIncome, "+ stockAwards", stockAwardIncome, "=", totalAnnualIncome);
        console.log(`=== END ${brokerage.name.toUpperCase()} DEBUG ===\n`);

        // Calculate comparison metrics if current brokerage is enabled
        let differenceFromCurrent = 0;
        let percentageImprovement = 0;
        
        if (currentBrokerageResult) {
          differenceFromCurrent = totalAnnualIncome - currentBrokerageResult.totalAnnualIncome;
          percentageImprovement = currentBrokerageResult.totalAnnualIncome !== 0 
            ? (differenceFromCurrent / currentBrokerageResult.totalAnnualIncome) * 100 
            : 0;
        }

        return {
          brokerage,
          grossCommission,
          brokerageCommission: capReached ? brokerage.cap : brokerageCommission,
          agentCommission: capReached ? grossCommission - brokerage.cap : agentCommission,
          annualFees,
          transactionFees,
          totalFees,
          capReached,
          capMonth: timeline.capMonth,
          postCapIncome,
          netIncome,
          revenueShareIncome,
          stockAwardIncome,
          totalAnnualIncome,
          monthlyBreakdown: {
            preCapMonthly,
            postCapMonthly,
            preCapMonths: timeline.preCapMonths,
            postCapMonths: timeline.postCapMonths
          },
          differenceFromCurrent,
          percentageImprovement,
          isCurrentBrokerage: false
        };
      });

      // Add current brokerage to results if enabled
      let finalResults = calculations;
      if (currentBrokerageResult) {
        // Create a fake brokerage data for current brokerage display
        const currentBrokerage: BrokerageData = {
          name: 'Your Current Brokerage',
          logo: '/logos/generic-brokerage-logo.svg',
          agentSplit: parseFloat(currentCommissionSplit.split('/')[0]) || 70,
          brokerageSplit: parseFloat(currentCommissionSplit.split('/')[1]) || 30,
          cap: parseFloat(currentAnnualCap) || 0,
          fees: {
            annual: parseFloat(currentAnnualFees) || 0,
            monthly: parseFloat(currentMonthlyFees) || 0,
            perTransaction: parseFloat(currentTransactionFees) || 0
          },
          revenueShare: {
            tier1Percentage: 0,
            description: 'No revenue share',
            multiTierDescription: 'Traditional brokerage'
          },
          stockAwards: {
            maxAnnual: 0,
            description: 'No stock awards',
            tradeable: false
          },
          color: 'bg-gray-600'
        };

        const currentResult: CalculationResult = {
          brokerage: currentBrokerage,
          grossCommission: currentBrokerageResult.grossCommission,
          brokerageCommission: currentBrokerageResult.brokerageCommission,
          agentCommission: currentBrokerageResult.agentCommission,
          annualFees: currentBrokerageResult.annualFees,
          transactionFees: currentBrokerageResult.transactionFees,
          totalFees: currentBrokerageResult.totalFees,
          capReached: currentBrokerageResult.capReached,
          capMonth: currentBrokerageResult.capMonth,
          postCapIncome: currentBrokerageResult.postCapIncome,
          netIncome: currentBrokerageResult.netIncome,
          revenueShareIncome: currentBrokerageResult.revenueShareIncome,
          stockAwardIncome: currentBrokerageResult.stockAwardIncome,
          totalAnnualIncome: currentBrokerageResult.totalAnnualIncome,
          monthlyBreakdown: currentBrokerageResult.monthlyBreakdown,
          differenceFromCurrent: 0,
          percentageImprovement: 0,
          isCurrentBrokerage: true
        };

        // Add current brokerage as first result
        finalResults = [currentResult, ...calculations];
      }

    setResults(finalResults);
    
    // Track brokerage comparison
    const comparedBrokerages = finalResults.map(result => result.brokerage.name);
    trackBrokerageComparison(comparedBrokerages);
    
    // Track calculator scenario with results
    if (finalResults.length > 0) {
      const topResult = finalResults.find(r => !r.isCurrentBrokerage) || finalResults[0];
      trackCalculatorScenario({
        gci: grossCommission,
        transactions: numTransactions,
        currentBrokerage: showCurrentBrokerage ? 'Custom Current Brokerage' : 'Not Specified',
        topSavingsBrokerage: topResult.brokerage.name,
        maxSavings: topResult.differenceFromCurrent,
        scenarioType: scenarioType
      });
    }
    
    // Track conversion event
    trackConversionEvent('calculator_results_generated', {
      gci: grossCommission,
      brokerages_compared: comparedBrokerages.length,
      includes_current: showCurrentBrokerage
    });
    
    setIsCalculating(false);
  };

  useEffect(() => {
    // Load calculation from URL on component mount
    loadCalculationFromURL();
  }, []);

  useEffect(() => {
    // Debounce calculations to prevent excessive re-renders and layout shifts
    const timer = setTimeout(() => {
      calculateResults();
    }, 300); // Increased from 50ms to 300ms to reduce jumping
    
    return () => clearTimeout(timer);
  }, [gci, transactions, recruits, recruitGci, recruitTransactions, recruitingGoal, isHighProducer, customTransactionFees, customPerTransactionFee, avgSalePrice, showCurrentBrokerage, currentCommissionSplit, currentAnnualCap, currentMonthlyFees, currentTransactionFees, currentAnnualFees, currentRoyaltyFees, currentOtherMonthlyCosts, showTraditional]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getWinnerIndex = () => {
    if (results.length === 0) return -1;
    
    // If current brokerage comparison is enabled, find best among cloud brokerages only
    if (showCurrentBrokerage) {
      const cloudBrokerages = results.filter(r => !r.isCurrentBrokerage);
      if (cloudBrokerages.length === 0) return -1;
      
      const bestCloudBrokerage = cloudBrokerages.reduce((best, current) => 
        current.totalAnnualIncome > best.totalAnnualIncome ? current : best
      );
      
      return results.findIndex(r => r === bestCloudBrokerage);
    }
    
    // Otherwise, find best overall
    return results.reduce((maxIndex, current, index) => {
      return current.totalAnnualIncome > results[maxIndex].totalAnnualIncome ? index : maxIndex;
    }, 0);
  };

  // Share Modal Component
  const ShareModal = ({ isOpen, onClose, shareUrl }: { isOpen: boolean; onClose: () => void; shareUrl: string }) => {
    if (!isOpen) return null;
    
    return (
      <div className="mobile-modal">
        <div className="mobile-modal-content max-w-md w-full mx-4 sm:mx-0">
          {/* Mobile header */}
          <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sm:hidden">
            <h3 className="text-lg font-semibold">Share Your Calculation</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Desktop header */}
          <div className="hidden sm:block p-6 pb-0">
            <h3 className="text-lg font-semibold mb-4">Share Your Calculation</h3>
          </div>
          
          <div className="p-4 sm:p-6">
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            This link contains your calculation inputs. When someone opens it, the calculator will automatically load your data and recalculate the results.
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-h-[44px] flex items-center justify-center"
            >
              Close
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  };

  // Logo Upload Handler
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      
      // Convert to data URL for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandingConfig(prev => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Branding Settings Modal Component
  const BrandingSettings = () => {
    const [tempConfig, setTempConfig] = useState(brandingConfig);

    // Update tempConfig when brandingConfig changes or modal opens
    useEffect(() => {
      if (showBrandingModal) {
        setTempConfig(brandingConfig);
      }
    }, [showBrandingModal, brandingConfig]);

    if (!showBrandingModal) return null;
    
    return (
      <div className="mobile-modal">
        <div className="mobile-modal-content max-w-2xl w-full mx-4 sm:mx-0">
          {/* Mobile header */}
          <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sm:hidden">
            <h2 className="text-xl font-semibold">Customize Your Branding</h2>
            <button
              onClick={() => {
                setTempConfig(brandingConfig);
                setShowBrandingModal(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Desktop header */}
          <div className="hidden sm:block p-6 pb-0">
            <h2 className="text-2xl font-semibold mb-6">Customize Your Branding</h2>
          </div>
          
          <div className="p-4 sm:p-6">
          
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {tempConfig.logo ? (
                <div className="space-y-4">
                  <img src={tempConfig.logo} alt="Logo preview" className="h-16 mx-auto" />
                  <button
                    onClick={() => setTempConfig(prev => ({ ...prev, logo: null }))}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove Logo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-gray-400">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    Upload your logo (PNG, JPG, SVG)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.type.startsWith('image/')) {
                          alert('Please select an image file');
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          alert('Image must be less than 2MB');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setTempConfig(prev => ({ ...prev, logo: event.target?.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>
          
          {/* Agent/Team Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name / Team Name
              </label>
              <input
                type="text"
                value={tempConfig.agentName || ''}
                onChange={(e) => setTempConfig(prev => ({ ...prev, agentName: e.target.value }))}
                placeholder="John Smith / Smith Real Estate Team"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={tempConfig.phone || ''}
                onChange={(e) => setTempConfig(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={tempConfig.email || ''}
                onChange={(e) => setTempConfig(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@realestategroup.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website (optional)
              </label>
              <input
                type="url"
                value={tempConfig.website || ''}
                onChange={(e) => setTempConfig(prev => ({ ...prev, website: e.target.value }))}
                placeholder="www.yoursite.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          {/* Color Customization */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Color
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={tempConfig.primaryColor || '#475569'}
                onChange={(e) => setTempConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                This color will be used for buttons and accents
              </span>
            </div>
          </div>
          
          {/* Tagline */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tempConfig.tagline || ''}
              onChange={(e) => setTempConfig(prev => ({ ...prev, tagline: e.target.value }))}
              placeholder="Helping agents maximize their potential"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          {/* Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
            <div className="bg-white p-4 rounded border" style={{ borderColor: tempConfig.primaryColor }}>
              <div className="flex items-center gap-3 mb-2">
                {tempConfig.logo && <img src={tempConfig.logo} alt="Logo" className="h-8" />}
                <div>
                  <div className="font-semibold" style={{ color: tempConfig.primaryColor }}>
                    {tempConfig.agentName || 'Your Name/Team'}
                  </div>
                  {tempConfig.tagline && <div className="text-sm text-gray-600">{tempConfig.tagline}</div>}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {tempConfig.phone && `📞 ${tempConfig.phone}`}
                {tempConfig.phone && tempConfig.email && ' | '}
                {tempConfig.email && `✉️ ${tempConfig.email}`}
                {(tempConfig.phone || tempConfig.email) && tempConfig.website && ' | '}
                {tempConfig.website && `🌐 ${tempConfig.website}`}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => {
                setTempConfig(brandingConfig);
                setShowBrandingModal(false);
              }}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 min-h-[44px] flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setBrandingConfig(tempConfig);
                setShowBrandingModal(false);
                setShowBrandingSaveSuccess(true);
                setTimeout(() => setShowBrandingSaveSuccess(false), 3000);
              }}
              className="w-full sm:w-auto px-6 py-2 text-white rounded-md hover:opacity-90 min-h-[44px] flex items-center justify-center"
              style={{ backgroundColor: tempConfig.primaryColor }}
            >
              Save Branding
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <div className="flex items-center space-x-3">
                {brandingConfig.logo ? (
                  <img src={brandingConfig.logo} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <BrokerageCompassIcon size={32} />
                )}
                <div>
                  <h1 
                    className="text-xl font-bold"
                    style={{ color: brandingConfig.primaryColor }}
                  >
                    {brandingConfig.agentName || 'BrokerageCompass'}
                  </h1>
                  {brandingConfig.tagline && (
                    <p className="text-sm text-gray-600">{brandingConfig.tagline}</p>
                  )}
                  {(brandingConfig.phone || brandingConfig.email) && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                      {brandingConfig.phone && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {brandingConfig.phone}
                        </span>
                      )}
                      {brandingConfig.email && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {brandingConfig.email}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBrandingModal(true)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Customize
              </button>
                            <NavigationButton
                trackingName="back_to_home"
                href="/" 
                className="font-semibold transition-colors"
                style={{ color: brandingConfig.primaryColor }}
              >
                ← Back to Home
              </NavigationButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Navigate Your Real Estate Career
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional brokerage comparison tool. Compare commission splits, fees, revenue share, and stock awards to make informed career decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24 border border-gray-200">
              {/* Scenario Presets */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Scenarios
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scenarios.map((scenario, index) => (
                    <button
                      key={index}
                      onClick={() => loadScenario(scenario)}
                      className="p-4 text-sm border border-gray-300 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 text-left group min-h-[44px] flex flex-col justify-center focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                      style={{ minHeight: '44px' }}
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-cyan-600">
                        {scenario.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {scenario.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Your Production Data
              </h2>
              
              <div className="space-y-6">
                {/* Basic Production Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Production</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="gci" className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Gross Commission Income (GCI) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          id="gci"
                          value={gci}
                          onChange={(e) => setGci(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base sm:text-lg transition-all"
                          style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '44px', fontSize: '16px' }}
                          placeholder="80,000"
                          inputMode="numeric"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="transactions" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Transactions *
                      </label>
                      <input
                        type="number"
                        id="transactions"
                        value={transactions}
                        onChange={(e) => setTransactions(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base sm:text-lg transition-all"
                        style={{ minHeight: '44px', fontSize: '16px' }}
                        placeholder="20"
                        inputMode="numeric"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Average Commission Per Transaction
                      </label>
                      <div className="bg-white px-4 py-3 rounded-xl border border-gray-200">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(parseFloat(avgCommission))}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isHighProducer}
                          onChange={(e) => setIsHighProducer(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            High Producer
                          </span>
                          <span className="text-xs text-gray-500 block">
                            20+ transactions OR $500K+ GCI
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Current Brokerage Comparison Section */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-900 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Your Current Brokerage
                    </h3>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showCurrentBrokerage}
                        onChange={(e) => setShowCurrentBrokerage(e.target.checked)}
                        className="w-5 h-5 rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm font-medium text-yellow-900">Enable Comparison</span>
                    </label>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-yellow-800">
                      💡 Add your current brokerage details to see exactly how much you'd save or gain by switching to each cloud brokerage.
                    </p>
                  </div>

                  {showCurrentBrokerage && (
                    <div className="space-y-4 border-l-4 border-yellow-300 pl-4">
                      <div>
                        <label htmlFor="currentCommissionSplit" className="block text-sm font-medium text-yellow-900 mb-2">
                          Current Commission Split *
                        </label>
                        <select
                          id="currentCommissionSplit"
                          value={currentCommissionSplit}
                          onChange={(e) => setCurrentCommissionSplit(e.target.value)}
                          className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white input-enhanced"
                        >
                          <option value="50/50">50/50 (Agent/Brokerage)</option>
                          <option value="60/40">60/40 (Agent/Brokerage)</option>
                          <option value="70/30">70/30 (Agent/Brokerage)</option>
                          <option value="80/20">80/20 (Agent/Brokerage)</option>
                          <option value="85/15">85/15 (Agent/Brokerage)</option>
                          <option value="90/10">90/10 (Agent/Brokerage)</option>
                          <option value="95/5">95/5 (Agent/Brokerage)</option>
                          <option value="100% (flat fee)">100% (Flat Fee)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="currentAnnualCap" className="block text-sm font-medium text-yellow-900 mb-2">
                          Current Annual Cap
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            id="currentAnnualCap"
                            value={currentAnnualCap}
                            onChange={(e) => setCurrentAnnualCap(e.target.value)}
                            className="w-full border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white"
                            style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '3rem' }}
                            placeholder="18,000 (0 if no cap)"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="currentMonthlyFees" className="block text-sm font-medium text-yellow-900 mb-2">
                          Current Monthly Fees
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            id="currentMonthlyFees"
                            value={currentMonthlyFees}
                            onChange={(e) => setCurrentMonthlyFees(e.target.value)}
                            onFocus={(e) => {
                              // Prevent auto-scroll on focus
                              e.target.scrollIntoView = () => {};
                            }}
                            className="w-full border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white"
                            style={{ 
                              paddingLeft: '40px', 
                              paddingRight: '16px', 
                              paddingTop: '12px', 
                              paddingBottom: '12px', 
                              minHeight: '3rem',
                              scrollMarginTop: '0px',
                              scrollBehavior: 'auto',
                              overflowAnchor: 'none'
                            }}
                            placeholder="500 (desk fees, franchise fees, etc.)"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="currentTransactionFees" className="block text-sm font-medium text-yellow-900 mb-2">
                          Current Transaction Fees
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            id="currentTransactionFees"
                            value={currentTransactionFees}
                            onChange={(e) => setCurrentTransactionFees(e.target.value)}
                            onFocus={(e) => {
                              // Prevent auto-scroll on focus
                              e.target.scrollIntoView = () => {};
                            }}
                            className="w-full border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white"
                            style={{ 
                              paddingLeft: '40px', 
                              paddingRight: '16px', 
                              paddingTop: '12px', 
                              paddingBottom: '12px', 
                              minHeight: '3rem',
                              scrollMarginTop: '0px',
                              scrollBehavior: 'auto',
                              overflowAnchor: 'none'
                            }}
                            placeholder="300 (per transaction)"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="currentAnnualFees" className="block text-sm font-medium text-yellow-900 mb-2">
                          Current Annual Fees
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            id="currentAnnualFees"
                            value={currentAnnualFees}
                            onChange={(e) => setCurrentAnnualFees(e.target.value)}
                            className="w-full border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white"
                            style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '3rem' }}
                            placeholder="0 (E&O, misc fees)"
                          />
                        </div>
                      </div>

                      {/* Advanced Current Brokerage Fields */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowAdvancedCurrent(!showAdvancedCurrent)}
                          className="flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-800 transition-colors"
                        >
                          <svg 
                            className={`w-4 h-4 mr-2 transition-transform ${showAdvancedCurrent ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Advanced Options (Optional)
                        </button>
                      </div>

                      {showAdvancedCurrent && (
                        <div className="space-y-4 bg-yellow-100 rounded-lg p-4">
                          <div>
                            <label htmlFor="currentRoyaltyFees" className="block text-sm font-medium text-yellow-900 mb-2">
                              Current Royalty/Franchise Fees (%)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                id="currentRoyaltyFees"
                                value={currentRoyaltyFees}
                                onChange={(e) => setCurrentRoyaltyFees(e.target.value)}
                                className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white input-enhanced"
                                placeholder="0 (percentage of GCI)"
                                step="0.1"
                                min="0"
                                max="20"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="currentOtherMonthlyCosts" className="block text-sm font-medium text-yellow-900 mb-2">
                              Other Monthly Costs
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <input
                                type="number"
                                id="currentOtherMonthlyCosts"
                                value={currentOtherMonthlyCosts}
                                onChange={(e) => setCurrentOtherMonthlyCosts(e.target.value)}
                                className="w-full border border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-white"
                            style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '3rem' }}
                                placeholder="0 (marketing fees, etc.)"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Transaction Fees Section */}
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2M9 9h6m0 4H9m0 4h6m0 0a2 2 0 102 2 2 2 0 00-2-2z" />
                    </svg>
                    Transaction Fees
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer mb-4">
                        <input
                          type="checkbox"
                          checked={customTransactionFees}
                          onChange={(e) => setCustomTransactionFees(e.target.checked)}
                          className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-orange-900">
                            Use Custom Transaction Fees
                          </span>
                          <span className="text-xs text-orange-700 block">
                            Override default brokerage fees
                          </span>
                        </div>
                      </label>
                    </div>

                    {customTransactionFees && (
                      <div className="space-y-4 border-l-4 border-orange-300 pl-4">
                        <div>
                          <label htmlFor="customPerTransactionFee" className="block text-sm font-medium text-orange-900 mb-2">
                            Custom Per-Transaction Fee
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              id="customPerTransactionFee"
                              value={customPerTransactionFee}
                              onChange={(e) => setCustomPerTransactionFee(e.target.value)}
                              className="w-full border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                            style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '3rem' }}
                              placeholder="50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="avgSalePrice" className="block text-sm font-medium text-orange-900 mb-2">
                        Average Sale Price (for percentage-based fees)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          id="avgSalePrice"
                          value={avgSalePrice}
                          onChange={(e) => setAvgSalePrice(e.target.value)}
                          className="w-full border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-white"
                            style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '3rem' }}
                          placeholder="Auto-calculated from GCI"
                        />
                      </div>
                      <p className="text-xs text-orange-700 mt-1">
                        Leave blank to auto-calculate (GCI ÷ Transactions × 20)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recruiting Section */}
                <div className="bg-cyan-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Recruiting & Revenue Share
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="recruitingGoal" className="block text-sm font-medium text-blue-900 mb-2">
                        Long-term Recruiting Goal
                      </label>
                      <select
                        id="recruitingGoal"
                        value={recruitingGoal}
                        onChange={(e) => setRecruitingGoal(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg bg-white input-enhanced"
                      >
                        <option value="1-2 agents">1-2 agents</option>
                        <option value="3-5 agents">3-5 agents</option>
                        <option value="6+ agents">6+ agents</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="recruits" className="block text-sm font-medium text-blue-900 mb-2">
                        Current Recruits
                      </label>
                      <input
                        type="number"
                        id="recruits"
                        value={recruits}
                        onChange={(e) => setRecruits(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg bg-white input-enhanced"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label htmlFor="recruitGci" className="block text-sm font-medium text-blue-900 mb-2">
                        Average GCI of Recruited Agents
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          id="recruitGci"
                          value={recruitGci}
                          onChange={(e) => setRecruitGci(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg bg-white"
                            style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', minHeight: '3rem' }}
                          placeholder="60,000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Summary */}
                {parseFloat(gci) > 0 && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-100">Annual GCI:</span>
                        <div className="font-bold text-white text-lg">{formatCurrency(parseFloat(gci))}</div>
                      </div>
                      <div>
                        <span className="text-blue-100">Status:</span>
                        <div className="font-bold text-white">{isHighProducer ? 'High Producer' : 'Standard'}</div>
                      </div>
                      <div>
                        <span className="text-blue-100">Recruiting Goal:</span>
                        <div className="font-bold text-white">{recruitingGoal}</div>
                      </div>
                      <div>
                        <span className="text-blue-100">Current Recruits:</span>
                        <div className="font-bold text-white">{recruits || 0}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stock Award Information */}
                {(isHighProducer || parseFloat(transactions) >= 15) && !showTraditional && (
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Stock Award Eligibility
                    </h3>
                    <div className="text-sm space-y-2">
                      <p className="text-purple-100">You may qualify for stock awards based on your production level:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className="bg-purple-800/50 rounded-lg p-3">
                          <div className="font-semibold">Real Brokerage</div>
                          <div className="text-xs text-purple-200">
                            {isHighProducer && parseFloat(transactions) >= 20 ? '✅ $16K-$24K eligible' : 'High producer + 20+ transactions needed'}
                          </div>
                        </div>
                        <div className="bg-purple-800/50 rounded-lg p-3">
                          <div className="font-semibold">eXp Realty</div>
                          <div className="text-xs text-purple-200">
                            {isHighProducer && parseFloat(transactions) >= 10 ? '✅ $16K+ eligible' : 'High producer + 10+ transactions needed'}
                          </div>
                        </div>
                        <div className="bg-purple-800/50 rounded-lg p-3">
                          <div className="font-semibold">Epique Realty</div>
                          <div className="text-xs text-purple-200">
                            {parseFloat(transactions) >= 15 ? '✅ $7.5K-$15K eligible' : '15+ transactions needed'}
                          </div>
                        </div>
                        <div className="bg-purple-800/50 rounded-lg p-3">
                          <div className="font-semibold">LPT Realty</div>
                          <div className="text-xs text-purple-200">
                            {parseFloat(transactions) >= 15 ? '✅ $2K-$5K eligible' : '15+ transactions needed'} (estimated)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results - Right Side */}
          <div className="lg:col-span-3 min-h-screen">
            {results.length > 0 ? (
              <div className="space-y-8 transition-all duration-200 ease-in-out">
                {/* Loading State */}
                {isCalculating && (
                  <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Calculating your personalized results...</p>
                  </div>
                )}

                {/* Toggle Switch for Cloud vs Traditional */}
                {!isCalculating && (
                  <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
                    <span className={`text-sm font-medium ${!showTraditional ? 'text-cyan-600' : 'text-gray-500'} sm:mr-3`}>
                      Cloud Brokerages
                    </span>
                    <button
                      onClick={() => setShowTraditional(!showTraditional)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        showTraditional ? 'bg-slate-600' : 'bg-gray-200'
                      }`}
                      style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showTraditional ? 'bg-slate-600' : 'bg-gray-200'
                      }`}>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showTraditional ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </button>
                    <span className={`text-sm font-medium ${showTraditional ? 'text-cyan-600' : 'text-gray-500'} sm:ml-3`}>
                      Traditional Brokerages
                    </span>
                  </div>
                )}

                {/* Section Headers */}
                {!isCalculating && (
                  <>
                    {!showTraditional && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                        Cloud Brokerage Comparison
                        <span className="block text-sm font-normal text-gray-600">
                          Modern, tech-forward brokerages with competitive splits
                        </span>
                      </h3>
                    )}

                    {showTraditional && (
                      <>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                          Traditional Brokerage Comparison  
                          <span className="block text-sm font-normal text-gray-600">
                            Established franchise brokerages with physical offices
                          </span>
                        </h3>
                        
                        {/* Comparison Callout for Traditional View */}
                        <div className="mb-4 p-4 bg-cyan-50 border border-slate-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            💡 <strong>Tip:</strong> Toggle to "Cloud Brokerages" to see how much you could save 
                            by switching from traditional to cloud-based models. Typical savings: $15K-$25K+ annually!
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Summary Section when current brokerage comparison is enabled */}
                {!isCalculating && showCurrentBrokerage && results.length > 1 && (
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl border border-slate-200">
                    <div className="flex items-center mb-4">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-bold">📊 Comparison Summary</h3>
                    </div>
                    
                    {(() => {
                      const cloudBrokerages = results.filter(r => !r.isCurrentBrokerage);
                      const bestOption = cloudBrokerages.reduce((best, current) => 
                        current.differenceFromCurrent > best.differenceFromCurrent ? current : best
                      );
                      
                      return (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-blue-100 mb-2">🏆 Best Option</h4>
                            <div className="text-2xl font-bold mb-1">{bestOption.brokerage.name}</div>
                            <div className="text-blue-100">
                              {bestOption.differenceFromCurrent >= 0 ? '+' : ''}{formatCurrency(bestOption.differenceFromCurrent)} more per year
                            </div>
                            <div className="text-sm text-blue-200">
                              {bestOption.percentageImprovement.toFixed(1)}% improvement
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-blue-100 mb-2">💰 Potential Savings</h4>
                            <div className="space-y-1">
                              {cloudBrokerages
                                .filter(r => r.differenceFromCurrent > 0)
                                .sort((a, b) => (b.differenceFromCurrent - a.differenceFromCurrent))
                                .slice(0, 3)
                                .map((result, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">{result.brokerage.name}:</span> +{formatCurrency(result.differenceFromCurrent)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Save/Share Buttons */}
                {!isCalculating && results.length > 0 && parseFloat(gci) > 0 && (
                  <div className="flex justify-center mb-6">
                    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 w-full max-w-4xl">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                        <button
                          onClick={saveCalculation}
                          className="w-full sm:w-auto px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 font-semibold min-h-[44px]"
                          style={{ backgroundColor: brandingConfig.primaryColor }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Save Calculation
                        </button>
                        
                        <button
                          onClick={handleShareCalculation}
                          className="w-full sm:w-auto px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 font-semibold min-h-[44px] focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          Share Results
                        </button>
                        
                        <button
                          onClick={handleExportPDF}
                          disabled={isGeneratingPDF}
                          className="w-full sm:w-auto px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                        >
                          {isGeneratingPDF ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Export PDF
                            </>
                          )}
                        </button>
                        
                        {savedCalculations.length > 0 && (
                          <div className="text-sm text-gray-600 text-center sm:text-left">
                            <div className="font-medium">Saved Calculations: {savedCalculations.length}</div>
                            <div className="text-xs">In-memory storage for this session</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Results Cards */}
                {!isCalculating && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 transition-all duration-300 ease-in-out">
                    {results.map((result, index) => {
                      const isWinner = index === getWinnerIndex();
                      return (
                        <div 
                          key={index} 
                          className={`bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-2 transition-all duration-300 hover:shadow-2xl ${
                            isWinner 
                              ? 'border-yellow-400 ring-2 ring-yellow-100' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 p-2 border border-gray-200 shadow-sm">
                                <Image
                                  src={result.brokerage.logo}
                                  alt={`${result.brokerage.name} logo`}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                  onError={(e) => {
                                    // Fallback to initials if logo fails to load
                                    const target = e.target as HTMLElement;
                                    target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = `w-8 h-8 ${result.brokerage.color} rounded-lg flex items-center justify-center`;
                                    fallback.innerHTML = `<span class="text-white font-bold text-sm">${result.brokerage.name.split(' ')[0].charAt(0)}</span>`;
                                    target.parentNode?.appendChild(fallback);
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {result.brokerage.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {result.brokerage.agentSplit}/{result.brokerage.brokerageSplit} split
                                </p>
                              </div>
                            </div>
                            {isWinner && (
                              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                                👑 Best Option
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Commission Income:</span>
                              <span className="font-bold text-green-600 text-lg">
                                {formatCurrency(result.netIncome - result.totalFees)}
                              </span>
                            </div>
                            
                            {/* Comparison indicators when current brokerage is enabled */}
                            {!result.isCurrentBrokerage && showCurrentBrokerage && (
                              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">Difference from Current:</span>
                                  <span className={`font-bold text-lg ${
                                    result.differenceFromCurrent >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {result.differenceFromCurrent >= 0 ? '+' : ''}{formatCurrency(result.differenceFromCurrent)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">Improvement:</span>
                                  <span className={`text-sm font-semibold ${
                                    result.percentageImprovement >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {result.percentageImprovement >= 0 ? '+' : ''}{result.percentageImprovement.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {result.isCurrentBrokerage && (
                              <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-yellow-800">Your Current Situation</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Transaction Fees:</span>
                              <span className="font-bold text-red-600 text-lg">
                                -{formatCurrency(result.transactionFees)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Annual Fees:</span>
                              <span className="font-bold text-red-600 text-lg">
                                -{formatCurrency(result.annualFees)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Revenue Share:</span>
                              <span className="font-bold text-cyan-600 text-lg">
                                {formatCurrency(result.revenueShareIncome)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Stock Awards:</span>
                              <span className="font-bold text-purple-600 text-lg">
                                {formatCurrency(result.stockAwardIncome)}
                                {result.brokerage.name === 'LPT Realty' && result.stockAwardIncome > 0 && (
                                  <span className="text-xs text-gray-500 ml-1">(estimated)</span>
                                )}
                              </span>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-lg">Total Annual Income:</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {formatCurrency(result.totalAnnualIncome)}
                                </span>
                              </div>
                            </div>
                            
                            {result.capReached && (
                              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4">
                                <p className="text-sm text-cyan-800 font-semibold flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Cap reached in Month {result.capMonth}
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                  Then 100% retention for {result.monthlyBreakdown.postCapMonths} months
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Enhanced Comparison Table */}
                {!isCalculating && (
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Complete Income Analysis
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Brokerage
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Commission
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Transaction Fees
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Revenue Share
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Stock Awards
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Total Income
                            </th>
                            {showCurrentBrokerage && (
                              <>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Difference
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Improvement
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results
                            .sort((a, b) => b.totalAnnualIncome - a.totalAnnualIncome)
                            .map((result, index) => {
                              const isWinner = index === 0;
                              return (
                                <tr key={index} className={isWinner ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 p-1 border border-gray-200">
                                        <Image
                                          src={result.brokerage.logo}
                                          alt={`${result.brokerage.name} logo`}
                                          width={24}
                                          height={24}
                                          className="object-contain"
                                          onError={(e) => {
                                            // Fallback to initials if logo fails to load
                                            const target = e.target as HTMLElement;
                                            target.style.display = 'none';
                                            const fallback = document.createElement('div');
                                            fallback.className = `w-6 h-6 ${result.brokerage.color} rounded flex items-center justify-center`;
                                            fallback.innerHTML = `<span class="text-white font-bold text-xs">${result.brokerage.name.split(' ')[0].charAt(0)}</span>`;
                                            target.parentNode?.appendChild(fallback);
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <div className="text-sm font-semibold text-gray-900 flex items-center">
                                          {result.brokerage.name}
                                          {isWinner && <span className="ml-2 text-yellow-500">👑</span>}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {result.brokerage.agentSplit}/{result.brokerage.brokerageSplit} split
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-green-600">
                                      {formatCurrency(result.netIncome - result.totalFees)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-red-600">
                                      -{formatCurrency(result.transactionFees)}
                                    </div>
                                    {parseFloat(transactions) > 0 && (
                                      <div className="text-xs text-gray-500">
                                        {transactions} transactions
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-cyan-600">
                                      {formatCurrency(result.revenueShareIncome)}
                                    </div>
                                    {parseFloat(recruits) > 0 && (
                                      <div className="text-xs text-gray-500">
                                        {recruits} agents
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-purple-600">
                                      {formatCurrency(result.stockAwardIncome)}
                                      {result.brokerage.name === 'LPT Realty' && result.stockAwardIncome > 0 && (
                                        <div className="text-xs text-gray-500">(estimated)</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-lg font-bold text-green-600">
                                      {formatCurrency(result.totalAnnualIncome)}
                                    </div>
                                  </td>
                                  {showCurrentBrokerage && (
                                    <>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {result.isCurrentBrokerage ? (
                                          <div className="text-sm text-gray-500 italic">-</div>
                                        ) : (
                                          <div className={`text-sm font-bold ${
                                            result.differenceFromCurrent >= 0 ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {result.differenceFromCurrent >= 0 ? '+' : ''}{formatCurrency(result.differenceFromCurrent)}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        {result.isCurrentBrokerage ? (
                                          <div className="text-sm text-gray-500 italic">Baseline</div>
                                        ) : (
                                          <div className={`text-sm font-bold ${
                                            result.percentageImprovement >= 0 ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {result.percentageImprovement >= 0 ? '+' : ''}{result.percentageImprovement.toFixed(1)}%
                                          </div>
                                        )}
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Transaction Fee Breakdown */}
                {!isCalculating && (
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2M9 9h6m0 4H9m0 4h6m0 0a2 2 0 102 2 2 2 0 00-2-2z" />
                        </svg>
                        Transaction Fee Breakdown
                      </h3>
                      <button
                        onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                      >
                        {showFeeBreakdown ? 'Hide' : 'Show'} Details
                      </button>
                    </div>
                    
                    {showFeeBreakdown && (
                      <div className="space-y-4">
                        <div className="bg-orange-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-orange-800">
                            {customTransactionFees 
                              ? `Using custom transaction fee: ${formatCurrency(parseFloat(customPerTransactionFee) || 0)} per transaction`
                              : 'Using brokerage-specific transaction fees'
                            }
                          </p>
                          {parseFloat(transactions) > 0 && (
                            <p className="text-sm text-orange-700 mt-1">
                              Total transactions: {transactions}
                            </p>
                          )}
                        </div>
                        
                        {results
                          .sort((a, b) => a.transactionFees - b.transactionFees)
                          .map((result, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 p-1 border border-gray-200">
                                  <Image
                                    src={result.brokerage.logo}
                                    alt={`${result.brokerage.name} logo`}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                    onError={(e) => {
                                      // Fallback to initials if logo fails to load
                                      const target = e.target as HTMLElement;
                                      target.style.display = 'none';
                                      const fallback = document.createElement('div');
                                      fallback.className = `w-6 h-6 ${result.brokerage.color} rounded flex items-center justify-center`;
                                      fallback.innerHTML = `<span class="text-white font-bold text-xs">${result.brokerage.name.split(' ')[0].charAt(0)}</span>`;
                                      target.parentNode?.appendChild(fallback);
                                    }}
                                  />
                                </div>
                                <h4 className="font-semibold text-gray-900">{result.brokerage.name}</h4>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-red-600">
                                  -{formatCurrency(result.transactionFees)}
                                </div>
                                <div className="text-xs text-gray-500">Total fees</div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              {customTransactionFees ? (
                                <p>• Custom fee: <span className="font-semibold">{formatCurrency(parseFloat(customPerTransactionFee) || 0)} × {transactions} transactions</span></p>
                              ) : (
                                <>
                                  {result.brokerage.fees.perTransaction && (
                                    <p>• Per-transaction: <span className="font-semibold">${result.brokerage.fees.perTransaction} × {transactions} transactions = {formatCurrency(result.brokerage.fees.perTransaction * parseFloat(transactions))}</span></p>
                                  )}
                                  {result.brokerage.fees.percentageOfSale && parseFloat(avgSalePrice || '0') > 0 && (
                                    <p>• Percentage fee: <span className="font-semibold">{(result.brokerage.fees.percentageOfSale * 100).toFixed(3)}% of ${formatCurrency(parseFloat(avgSalePrice))} sale price</span>
                                    {result.brokerage.fees.maxPerTransaction && <span className="text-gray-500"> (capped at ${result.brokerage.fees.maxPerTransaction})</span>}
                                    </p>
                                  )}
                                  {!result.brokerage.fees.perTransaction && !result.brokerage.fees.percentageOfSale && (
                                    <p>• No transaction fees</p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cap Timeline */}
                {!isCalculating && (
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Cap Timeline Analysis
                      </h3>
                      <button
                        onClick={() => setShowCapTimeline(!showCapTimeline)}
                        className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                      >
                        {showCapTimeline ? 'Hide' : 'Show'} Timeline
                      </button>
                    </div>
                    
                    {showCapTimeline && (
                      <div className="space-y-4">
                        {results
                          .sort((a, b) => b.totalAnnualIncome - a.totalAnnualIncome)
                          .map((result, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 p-1 border border-gray-200">
                                <Image
                                  src={result.brokerage.logo}
                                  alt={`${result.brokerage.name} logo`}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  onError={(e) => {
                                    // Fallback to initials if logo fails to load
                                    const target = e.target as HTMLElement;
                                    target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = `w-6 h-6 ${result.brokerage.color} rounded flex items-center justify-center`;
                                    fallback.innerHTML = `<span class="text-white font-bold text-xs">${result.brokerage.name.split(' ')[0].charAt(0)}</span>`;
                                    target.parentNode?.appendChild(fallback);
                                  }}
                                />
                              </div>
                              <h4 className="font-semibold text-gray-900">{result.brokerage.name}</h4>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              {result.capReached ? (
                                <div>
                                  <p>• Months 1-{result.capMonth}: <span className="font-semibold text-green-600">{formatCurrency(result.monthlyBreakdown.preCapMonthly)}/month</span></p>
                                  {result.monthlyBreakdown.postCapMonths > 0 && (
                                    <p>• Months {result.capMonth + 1}-12: <span className="font-semibold text-green-600">{formatCurrency(result.monthlyBreakdown.postCapMonthly)}/month</span> (100% retention)</p>
                                  )}
                                  <p className="font-semibold text-green-600 mt-2">
                                    ✅ Cap reached in Month {result.capMonth}
                                  </p>
                                </div>
                              ) : (
                                <p>• All 12 months: <span className="font-semibold text-green-600">{formatCurrency(result.monthlyBreakdown.preCapMonthly)}/month</span> (cap not reached)</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
                <div className="text-gray-400 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                {showTraditional && traditionalBrokerages.length === 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Traditional Brokerages Coming Soon
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Traditional brokerage data will be added soon. For now, toggle back to "Cloud Brokerages" to see comprehensive comparisons.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => setShowTraditional(false)}
                        className="bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                      >
                        View Cloud Brokerages
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Advanced Calculator Ready
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Try a quick scenario above or enter your data to see comprehensive financial projections
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <CalculatorButton
                        trackingName="try_example_experienced"
                        onClick={() => loadScenario(scenarios[1])}
                      >
                        Try Example: Experienced Agent
                      </CalculatorButton>
                      <CalculatorButton
                        trackingName="try_example_team_leader"
                        onClick={() => loadScenario(scenarios[2])}
                      >
                        Try Example: Team Leader
                      </CalculatorButton>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        shareUrl={shareUrl} 
      />

      {/* Branding Settings Modal */}
      <BrandingSettings />

      {/* Success Notifications */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Calculation saved successfully!
        </div>
      )}

      {showCopySuccess && (
        <div className="fixed top-4 right-4 bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Link copied to clipboard!
        </div>
      )}

      {showPDFSuccess && (
        <div className="fixed top-4 right-4 bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          PDF downloaded successfully!
        </div>
      )}

      {showPDFError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Failed to generate PDF. Please try again.
        </div>
      )}

      {showBrandingSaveSuccess && (
        <div className="fixed top-4 right-4 bg-cyan-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Branding customization saved successfully!
        </div>
      )}
    </div>
  );
} 