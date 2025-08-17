import { track } from '@vercel/analytics';

// Google Analytics 4 tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics event tracking
export const trackGAEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      send_to: 'G-77PNPC0WQW',
      ...parameters
    });
  }
};

// Track calculator usage for GA4
export const trackGACalculatorUse = (brokerageType: 'cloud' | 'traditional', data: {
  gci: number;
  transactions: number;
  currentBrokerage: string;
}) => {
  trackGAEvent('calculator_usage', {
    brokerage_type: brokerageType,
    gci_amount: data.gci,
    transaction_count: data.transactions,
    current_brokerage: data.currentBrokerage,
    event_category: 'Calculator',
    event_label: `${brokerageType}_${data.currentBrokerage}`
  });
};

// Track PDF downloads for GA4
export const trackGAPDFDownload = (scenario: string, data: {
  gci: number;
  bestBrokerage: string;
  savingsAmount: number;
}) => {
  trackGAEvent('pdf_download', {
    scenario: scenario,
    gci_amount: data.gci,
    best_brokerage: data.bestBrokerage,
    savings_amount: data.savingsAmount,
    event_category: 'Conversion',
    event_label: `PDF_${data.bestBrokerage}`
  });
};

// Track demo interactions for GA4
export const trackGADemoInteraction = (action: string, data?: Record<string, any>) => {
  trackGAEvent('demo_interaction', {
    action: action,
    event_category: 'Engagement',
    event_label: `Demo_${action}`,
    ...data
  });
};

// Track brokerage comparisons for GA4
export const trackGABrokerageComparison = (brokerages: string[], data: {
  gci: number;
  topSavingsBrokerage: string;
  maxSavings: number;
}) => {
  trackGAEvent('brokerage_comparison', {
    brokerages_compared: brokerages.join(','),
    comparison_count: brokerages.length,
    gci_amount: data.gci,
    top_savings_brokerage: data.topSavingsBrokerage,
    max_savings: data.maxSavings,
    event_category: 'Calculator',
    event_label: `Comparison_${brokerages.length}_brokerages`
  });
};

// Track page views for GA4
export const trackGAPageView = (page: string, data?: Record<string, any>) => {
  trackGAEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: page,
    event_category: 'Navigation',
    ...data
  });
};

// Track calculator usage
export const trackCalculatorUsage = (data: {
  gci: number;
  transactions: number;
  currentBrokerage: string;
  recruitedAgents?: number;
  timestamp?: string;
}) => {
  // Vercel Analytics
  track('calculator_used', {
    gci: data.gci,
    transactions: data.transactions,
    current_brokerage: data.currentBrokerage,
    recruited_agents: data.recruitedAgents || 0,
    timestamp: data.timestamp || new Date().toISOString()
  });
  
  // Google Analytics
  trackGAEvent('calculator_used', {
    gci_amount: data.gci,
    transaction_count: data.transactions,
    current_brokerage: data.currentBrokerage,
    recruited_agents: data.recruitedAgents || 0,
    event_category: 'Calculator',
    event_label: data.currentBrokerage
  });
};

// Track brokerage comparisons
export const trackBrokerageComparison = (brokerages: string[]) => {
  // Vercel Analytics
  track('brokerages_compared', {
    brokerages: brokerages.join(','),
    comparison_type: brokerages.includes('Real Brokerage') ? 'includes_real' : 'no_real',
    count: brokerages.length
  });
  
  // Google Analytics
  trackGAEvent('brokerages_compared', {
    brokerages_compared: brokerages.join(','),
    comparison_type: brokerages.includes('Real Brokerage') ? 'includes_real' : 'no_real',
    comparison_count: brokerages.length,
    event_category: 'Calculator',
    event_label: `${brokerages.length}_brokerages`
  });
};

// Track PDF downloads
export const trackPDFDownload = (data: {
  gci: number;
  bestBrokerage: string;
  savingsAmount: number;
  includesRevenueShare?: boolean;
}) => {
  // Vercel Analytics
  track('pdf_downloaded', {
    gci: data.gci,
    best_brokerage: data.bestBrokerage,
    savings_amount: data.savingsAmount,
    agent_type: data.gci > 100000 ? 'high_producer' : 'standard',
    includes_revenue_share: data.includesRevenueShare || false
  });
  
  // Google Analytics
  trackGAEvent('pdf_download', {
    gci_amount: data.gci,
    best_brokerage: data.bestBrokerage,
    savings_amount: data.savingsAmount,
    agent_type: data.gci > 100000 ? 'high_producer' : 'standard',
    includes_revenue_share: data.includesRevenueShare || false,
    event_category: 'Conversion',
    event_label: `PDF_${data.bestBrokerage}`,
    value: data.savingsAmount
  });
};

// Track share actions
export const trackShareAction = (method: string, data: {
  gci: number;
  bestBrokerage: string;
  savingsAmount: number;
}) => {
  track('results_shared', {
    method: method, // 'link', 'social', 'email'
    gci: data.gci,
    best_brokerage: data.bestBrokerage,
    savings_amount: data.savingsAmount
  });
};

// Track demo usage on landing page
export const trackDemoUsage = (action: string, data: {
  field?: string;
  value?: number;
  gci: number;
  savings: number;
}) => {
  track('landing_demo_used', {
    action: action, // 'input_changed', 'scenario_selected'
    field: data.field,
    value: data.value,
    gci: data.gci,
    savings_displayed: data.savings
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  // Vercel Analytics
  track('button_clicked', {
    button_name: buttonName,
    location: location, // 'hero', 'demo', 'footer', 'nav', 'calculator'
    timestamp: new Date().toISOString()
  });
  
  // Google Analytics
  trackGAEvent('button_click', {
    button_name: buttonName,
    button_location: location,
    event_category: 'Engagement',
    event_label: `${location}_${buttonName}`
  });
};

// Track page views with custom data
export const trackPageView = (page: string, data: Record<string, any> = {}) => {
  track('page_viewed', {
    page: page,
    ...data
  });
};

// Track conversion funnel events
export const trackConversionEvent = (event: string, data: Record<string, any> = {}) => {
  track('conversion_event', {
    event: event, // 'landing_viewed', 'demo_interacted', 'calculator_started', 'results_generated', 'pdf_exported'
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Track user engagement metrics
export const trackEngagement = (action: string, data: {
  timeOnPage?: number;
  scrollDepth?: number;
  interactionCount?: number;
  featureUsed?: string;
}) => {
  track('user_engagement', {
    action: action,
    time_on_page: data.timeOnPage,
    scroll_depth: data.scrollDepth,
    interaction_count: data.interactionCount,
    feature_used: data.featureUsed,
    timestamp: new Date().toISOString()
  });
};

// Track calculator scenarios
export const trackCalculatorScenario = (data: {
  gci: number;
  transactions: number;
  currentBrokerage: string;
  topSavingsBrokerage: string;
  maxSavings: number;
  scenarioType: string;
}) => {
  track('calculator_scenario', {
    gci: data.gci,
    transactions: data.transactions,
    current_brokerage: data.currentBrokerage,
    top_savings_brokerage: data.topSavingsBrokerage,
    max_savings: data.maxSavings,
    scenario_type: data.scenarioType, // 'low_volume', 'mid_volume', 'high_volume', 'high_producer'
    timestamp: new Date().toISOString()
  });
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: string, data: Record<string, any> = {}) => {
  track('form_interaction', {
    form_name: formName,
    action: action, // 'started', 'field_changed', 'submitted', 'abandoned'
    ...data,
    timestamp: new Date().toISOString()
  });
};
