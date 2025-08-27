import React from 'react';

// Main logo component with calculator design  
export const BrokerageCalcLogo = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer compass ring */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#475569"
        strokeWidth="4"
        className="compass-ring"
      />
      
      {/* Inner compass circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="#f8fafc"
        stroke="#06b6d4"
        strokeWidth="2"
        className="compass-face"
      />
      
      {/* Compass needle pointing directions */}
      <g className="compass-needle">
        {/* North arrow (pointing up) - Cyan */}
        <path
          d="M50 15 L45 30 L50 25 L55 30 Z"
          fill="#06b6d4"
          className="north-arrow"
        />
        
        {/* South arrow (pointing down) - Slate */}
        <path
          d="M50 85 L45 70 L50 75 L55 70 Z"
          fill="#475569"
          className="south-arrow"
        />
        
        {/* East arrow (pointing right) - Light slate */}
        <path
          d="M85 50 L70 45 L75 50 L70 55 Z"
          fill="#64748b"
          className="east-arrow"
        />
        
        {/* West arrow (pointing left) - Light slate */}
        <path
          d="M15 50 L30 45 L25 50 L30 55 Z"
          fill="#64748b"
          className="west-arrow"
        />
      </g>
      
      {/* Center compass point */}
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="#475569"
        className="compass-center"
      />
      
      {/* Compass markings */}
      <g className="compass-markings" stroke="#475569" strokeWidth="1">
        {/* Major direction lines */}
        <line x1="50" y1="8" x2="50" y2="18" />
        <line x1="92" y1="50" x2="82" y2="50" />
        <line x1="50" y1="92" x2="50" y2="82" />
        <line x1="8" y1="50" x2="18" y2="50" />
        
        {/* Minor direction markers */}
        <line x1="73.5" y1="26.5" x2="70.5" y2="29.5" />
        <line x1="73.5" y1="73.5" x2="70.5" y2="70.5" />
        <line x1="26.5" y1="73.5" x2="29.5" y2="70.5" />
        <line x1="26.5" y1="26.5" x2="29.5" y2="29.5" />
      </g>
    </svg>
  );
};

// Logo with text component
export const BrokerageCalcLogoWithText = ({ size = "md", orientation = "horizontal", showTagline = true }) => {
  const logoSize = size === "sm" ? 32 : size === "lg" ? 56 : 40;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  
  if (orientation === "vertical") {
    return (
      <div className="flex flex-col items-center gap-2">
        <BrokerageCalcLogo size={logoSize} />
        <div className="text-center">
          <div className={`${textSize} font-bold text-slate-700`}>
            BrokerageCalc
          </div>
          {showTagline && (
            <div className="text-sm text-slate-500">
              Calculate Your Real Estate Earnings
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      <BrokerageCalcLogo size={logoSize} />
      <div>
        <div className={`${textSize} font-bold text-slate-700`}>
          BrokerageCalc
        </div>
        {showTagline && (
          <div className="text-sm text-slate-500">
            Calculate Your Real Estate Earnings
          </div>
        )}
      </div>
    </div>
  );
};

// Icon-only version for small spaces
export const BrokerageCalcIcon = ({ size = 24, className = "", variant = "default" }) => {
  // Color variants
  const colors = {
    default: {
      ring: "#475569",
      face: "#f8fafc",
      border: "#06b6d4",
      north: "#06b6d4",
      south: "#475569",
      center: "#475569"
    },
    white: {
      ring: "#ffffff",
      face: "#f8fafc",
      border: "#ffffff",
      north: "#ffffff",
      south: "#e2e8f0",
      center: "#ffffff"
    },
    monochrome: {
      ring: "#475569",
      face: "#f8fafc",
      border: "#475569",
      north: "#475569",
      south: "#64748b",
      center: "#475569"
    }
  };
  
  const colorScheme = colors[variant] || colors.default;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified version for small sizes */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke={colorScheme.ring} 
        strokeWidth="6"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="30" 
        fill={colorScheme.face} 
        stroke={colorScheme.border} 
        strokeWidth="3"
      />
      
      {/* Simplified needle */}
      <path 
        d="M50 20 L45 35 L50 30 L55 35 Z" 
        fill={colorScheme.north}
      />
      <path 
        d="M50 80 L45 65 L50 70 L55 65 Z" 
        fill={colorScheme.south}
      />
      
      <circle 
        cx="50" 
        cy="50" 
        r="5" 
        fill={colorScheme.center}
      />
    </svg>
  );
};

// Animated version for loading states
export const BrokerageCalcLogoAnimated = ({ size = 40, className = "" }) => {
  return (
    <div className={`${className} relative`}>
      <BrokerageCalcLogo size={size} />
      <style jsx>{`
        .compass-needle {
          animation: spin 4s linear infinite;
          transform-origin: 50px 50px;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
