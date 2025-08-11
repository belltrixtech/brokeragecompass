'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { BrokerageCompassIcon, BrokerageCompassLogoWithText } from '../components/Logo';
import { motion } from 'framer-motion';
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCounter, 
  AnimatedButton,
  AnimatedCard
} from '../components/Animations';

// Interactive Demo Component
const InteractiveDemoSection = () => {
  const [demoInputs, setDemoInputs] = useState({
    gci: 80000,
    transactions: 20,
    currentSplit: 70,
    currentMonthlyFees: 1000
  });

  const [demoResults, setDemoResults] = useState({
    currentIncome: 0,
    realIncome: 0,
    savings: 0,
    savingsPercentage: '0'
  });

  // Calculate results in real-time
  useEffect(() => {
    const calculateDemoResults = () => {
      const { gci, transactions, currentSplit, currentMonthlyFees } = demoInputs;
      
      // Current brokerage calculation
      const currentBrokeragePayment = gci * (1 - currentSplit / 100);
      const currentFees = currentMonthlyFees * 12;
      const currentIncome = gci - currentBrokeragePayment - currentFees;
      
      // Real Brokerage calculation (85/15 split, $12K cap)
      const realBrokeragePayment = Math.min(gci * 0.15, 12000);
      const realFees = 750 + (transactions * 30); // Annual fee + transaction fees
      const realIncome = gci - realBrokeragePayment - realFees;
      
      // Calculate savings
      const savings = realIncome - currentIncome;
      
      setDemoResults({
        currentIncome: Math.max(0, currentIncome),
        realIncome: Math.max(0, realIncome),
        savings: savings,
        savingsPercentage: currentIncome > 0 ? ((savings / currentIncome) * 100).toFixed(1) : '0'
      });
    };

    calculateDemoResults();
  }, [demoInputs]);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See Your Potential Savings
            <span className="text-cyan-500"> Instantly</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Adjust the numbers below to see how much you could save by switching brokerages. 
            This is a live calculation using real commission structures.
          </p>
        </FadeInUp>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <FadeInLeft>
            <AnimatedCard className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Your Numbers
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Gross Commission Income (GCI)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={demoInputs.gci}
                    onChange={(e) => setDemoInputs(prev => ({ ...prev, gci: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg"
                  />
                </div>
                <input
                  type="range"
                  min="30000"
                  max="300000"
                  step="5000"
                  value={demoInputs.gci}
                  onChange={(e) => setDemoInputs(prev => ({ ...prev, gci: parseInt(e.target.value) }))}
                  className="w-full mt-2 accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Transactions
                </label>
                <input
                  type="number"
                  value={demoInputs.transactions}
                  onChange={(e) => setDemoInputs(prev => ({ ...prev, transactions: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg"
                />
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={demoInputs.transactions}
                  onChange={(e) => setDemoInputs(prev => ({ ...prev, transactions: parseInt(e.target.value) }))}
                  className="w-full mt-2 accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Commission Split (You Keep %)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={demoInputs.currentSplit}
                    onChange={(e) => setDemoInputs(prev => ({ ...prev, currentSplit: parseInt(e.target.value) }))}
                    className="flex-1 accent-cyan-500"
                  />
                  <span className="text-lg font-semibold text-gray-900 min-w-[60px]">
                    {demoInputs.currentSplit}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Monthly Fees
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={demoInputs.currentMonthlyFees}
                    onChange={(e) => setDemoInputs(prev => ({ ...prev, currentMonthlyFees: parseInt(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="100"
                  value={demoInputs.currentMonthlyFees}
                  onChange={(e) => setDemoInputs(prev => ({ ...prev, currentMonthlyFees: parseInt(e.target.value) }))}
                  className="w-full mt-2 accent-cyan-500"
                />
              </div>
            </div>
            </AnimatedCard>
          </FadeInLeft>

          {/* Results Section */}
          <FadeInRight>
            <AnimatedCard className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">
              Your Potential Savings
            </h3>
            
            <div className="space-y-6">
              {/* Current vs Real Comparison */}
              <div className="bg-gray-50 p-6 rounded-lg demo-result">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Current Brokerage:</span>
                  <span className="text-xl font-semibold text-gray-900 number-transition">
                    ${demoResults.currentIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Real Brokerage:</span>
                  <span className="text-xl font-semibold text-cyan-600 number-transition">
                    ${demoResults.realIncome.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className={`bg-cyan-50 p-6 rounded-lg border border-cyan-200 demo-result ${demoResults.savings > 5000 ? 'savings-highlight' : ''}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600 mb-2 number-transition">
                    {demoResults.savings >= 0 ? '+' : ''}${demoResults.savings.toLocaleString()}
                  </div>
                  <div className="text-cyan-700 font-medium">
                    Annual Savings ({demoResults.savingsPercentage}% {demoResults.savings >= 0 ? 'increase' : 'decrease'})
                  </div>
                  <div className="text-sm text-cyan-600 mt-2">
                    That&apos;s ${Math.abs(Math.round(demoResults.savings / 12)).toLocaleString()} {demoResults.savings >= 0 ? 'more' : 'less'} per month!
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <Link
                  href="/calculator"
                  className="block w-full bg-cyan-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                  Get Complete Analysis
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  See detailed breakdown with all brokerages
                </p>
              </div>
            </div>
            </AnimatedCard>
          </FadeInRight>
        </div>

        {/* Trust Indicators */}
        <FadeInUp delay={0.3} className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Calculations based on official brokerage commission structures
          </p>
          <StaggerContainer className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <StaggerItem><span className="text-sm font-medium">Real Brokerage</span></StaggerItem>
            <StaggerItem><span className="text-sm font-medium">eXp Realty</span></StaggerItem>
            <StaggerItem><span className="text-sm font-medium">Epique Realty</span></StaggerItem>
            <StaggerItem><span className="text-sm font-medium">LPT Realty</span></StaggerItem>
          </StaggerContainer>
        </FadeInUp>
      </div>
    </section>
  );
};

export default function Home() {
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
            <Link
              href="/calculator"
              className="bg-cyan-500 text-white px-6 py-2.5 rounded-lg hover:bg-cyan-600 transition-colors font-semibold shadow-sm focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

            {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Stop Guessing. Start
              <span className="text-slate-600"> Calculating.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto"
            >
              See exactly how much you could earn at different brokerages. 
              Built by a Real agent, for agents who want the truth about their options.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <AnimatedButton
                href="/calculator"
                className="px-8 py-4 bg-cyan-500 text-white text-lg font-semibold rounded-lg hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Compare Brokerages Now
              </AnimatedButton>
              <AnimatedButton className="px-8 py-4 border-2 border-slate-600 text-slate-600 text-lg font-semibold rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                Watch 2-Min Demo
              </AnimatedButton>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="text-sm text-gray-500 mt-4"
            >
              Free tool • No signup required • Used by <AnimatedCounter end={500} suffix="+" /> agents
            </motion.p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* Problem Statement Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Tired of Complex Commission Structures?
            </h2>
          </FadeInUp>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Confusing Fee Structures</h3>
                <p className="text-gray-600">Hidden fees, complex caps, and unclear revenue share models</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Impossible to Compare</h3>
                <p className="text-gray-600">Every brokerage structures things differently - apples to oranges</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Costly Mistakes</h3>
                <p className="text-gray-600">Choose wrong and lose thousands per year in unnecessary fees</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Solution/Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Finally, Clear Answers
            </h2>
            <p className="text-xl text-gray-600">
              Compare real numbers across cloud and traditional brokerages
            </p>
          </FadeInUp>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInLeft>
              <StaggerContainer className="space-y-8">
                <StaggerItem>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Complete Financial Picture</h3>
                      <p className="text-gray-600">Commission splits, caps, fees, revenue share, and stock awards - all calculated automatically</p>
                    </div>
                  </div>
                </StaggerItem>
                
                <StaggerItem>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Your Current vs. New</h3>
                      <p className="text-gray-600">See exactly how much you would save (or lose) by switching brokerages</p>
                    </div>
                  </div>
                </StaggerItem>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Professional Reports</h3>
                    <p className="text-gray-600">Share calculations via link or export professional PDF reports</p>
                  </div>
                </div>
              </StaggerContainer>
            </FadeInLeft>
            
            <FadeInRight>
              <AnimatedCard className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-cyan-600">$18,500</div>
                <div className="text-gray-600">Average annual savings</div>
                <div className="text-sm text-gray-500">when switching from traditional to cloud brokerage</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Commission Savings:</span>
                  <span className="font-semibold">$12,000</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Reduced Fees:</span>
                  <span className="font-semibold">$4,200</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Revenue Share:</span>
                  <span className="font-semibold">$2,300</span>
                </div>
              </div>
              </AnimatedCard>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* About/Credibility Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built by an Agent, for Agents
            </h2>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <AnimatedCard className="bg-cyan-50 p-8 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                NB
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">Why I Built This Tool</h3>
                <p className="text-gray-700 mb-4">
                  As a Real Brokerage agent, I was constantly asked by other agents about our commission structure 
                  and how it compared to their current brokerage. The calculations were complex, and I wanted to 
                  give them accurate, transparent information to make informed decisions.
                </p>
                <p className="text-gray-700">
                  This tool uses real data from official brokerage documents and fee schedules. 
                  No marketing fluff - just honest numbers to help you navigate your career.
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  Licensed Real Estate Agent | Real Brokerage Team Member | CA License #02150284
                </div>
              </div>
            </div>
            </AnimatedCard>
          </FadeInUp>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-600 to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to See Your Real Numbers?
            </h2>
            <p className="text-xl text-cyan-200 mb-8">
              Takes 2 minutes. No signup required. Get your personalized comparison instantly.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <AnimatedButton
              href="/calculator"
              className="inline-block px-8 py-4 bg-cyan-500 text-white text-lg font-semibold rounded-lg hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Start Your Comparison
            </AnimatedButton>
          </FadeInUp>
          <p className="text-sm text-cyan-200 mt-4">
            Questions? Email nick@brokeragecompass.com or call (555) 123-4567
          </p>
        </div>
      </section>

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