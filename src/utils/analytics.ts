import { track } from '@vercel/analytics';

// Track calculator usage
export const trackCalculatorUsage = (data: {
  gci: number;
  transactions: number;
  currentBrokerage: string;
  recruitedAgents?: number;
  timestamp?: string;
}) => {
  track('calculator_used', {
    gci: data.gci,
    transactions: data.transactions,
    current_brokerage: data.currentBrokerage,
    recruited_agents: data.recruitedAgents || 0,
    timestamp: data.timestamp || new Date().toISOString()
  });
};

// Track brokerage comparisons
export const trackBrokerageComparison = (brokerages: string[]) => {
  track('brokerages_compared', {
    brokerages: brokerages.join(','),
    comparison_type: brokerages.includes('Real Brokerage') ? 'includes_real' : 'no_real',
    count: brokerages.length
  });
};

// Track PDF downloads
export const trackPDFDownload = (data: {
  gci: number;
  bestBrokerage: string;
  savingsAmount: number;
  includesRevenueShare?: boolean;
}) => {
  track('pdf_downloaded', {
    gci: data.gci,
    best_brokerage: data.bestBrokerage,
    savings_amount: data.savingsAmount,
    agent_type: data.gci > 100000 ? 'high_producer' : 'standard',
    includes_revenue_share: data.includesRevenueShare || false
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
  track('button_clicked', {
    button_name: buttonName,
    location: location, // 'hero', 'demo', 'footer', 'nav', 'calculator'
    timestamp: new Date().toISOString()
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
