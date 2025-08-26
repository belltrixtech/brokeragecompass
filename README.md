# Real Estate Cloud Brokerage Comparison Calculator

A web application that helps real estate agents compare earnings between different cloud brokerages. Agents can input their production data and see side-by-side financial comparisons to make informed decisions about their brokerage choice.

## Features

- **Commission Calculator**: Compare net income after splits, caps, and fees
- **Side-by-side Comparison**: Clear visualization of earnings across brokerages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface built with Tailwind CSS

## Supported Brokerages

- **Cloud Brokerages**: Competitive splits and caps
- **eXp Realty**: 80/20 split, $16K cap  
- **Epique Realty**: 85/15 split, $15K cap
- **LPT Realty**: 80/20 split, $15K cap

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React hooks
- **Analytics**: Google Analytics 4 + Vercel Analytics

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd brokerage-calculator
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## How to Use

1. **Visit the Landing Page**: Learn about the tool and its features
2. **Navigate to Calculator**: Click "Get Started" or "Start Comparison"
3. **Enter Your Data**:
   - Annual Gross Commission Income (GCI) - Required
   - Number of Transactions - Optional
   - Potential Recruits - Optional (for future revenue share features)
4. **View Results**: See your personalized comparison across all brokerages
5. **Analyze**: Use the detailed breakdown table to understand the numbers

## Commission Calculation Logic

The calculator uses the following logic for each brokerage:

- **Before Cap**: Agent receives their split percentage of gross commission
- **After Cap**: Once the brokerage receives their cap amount, agent keeps 100% of remaining commissions
- **Net Income**: Total commission earnings after all brokerage fees

## Future Enhancements

- Revenue share calculator for recruiting income
- Additional brokerage comparisons
- Transaction fee calculations
- Annual projection tools
- Export/save functionality

## Analytics Implementation

This application includes dual analytics tracking:

### Google Analytics 4
- **Measurement ID**: G-77PNPC0WQW
- **Events tracked**: Calculator usage, brokerage comparisons, PDF downloads, demo interactions
- **Implementation**: Uses Next.js Script component with afterInteractive strategy

### Vercel Analytics
- **Purpose**: Performance and usage analytics
- **Implementation**: Vercel's built-in analytics package

### Key Events Tracked
- Calculator form submissions
- Brokerage type toggles (cloud vs traditional)
- PDF export conversions
- Button clicks and user interactions
- Page views and session data

## Contributing

This project was built to help real estate agents make informed decisions about their brokerage choice. Contributions and suggestions are welcome!

## License

Built for educational and comparison purposes. Not affiliated with any brokerage mentioned.
