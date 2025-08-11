'use client';

import { ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import { trackButtonClick } from '../utils/analytics';

interface TrackedButtonProps {
  children: ReactNode;
  trackingName: string;
  trackingLocation: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  [key: string]: any;
}

export const TrackedButton = ({ 
  children, 
  trackingName, 
  trackingLocation, 
  onClick, 
  href, 
  className = '',
  type = 'button',
  disabled = false,
  ...props 
}: TrackedButtonProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      trackButtonClick(trackingName, trackingLocation);
      if (onClick) onClick(e);
    }
  };

  // If href is provided, render as Link
  if (href) {
    return (
      <Link 
        href={href} 
        className={className}
        onClick={() => trackButtonClick(trackingName, trackingLocation)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button 
      type={type}
      onClick={handleClick} 
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Pre-configured button variants for common use cases
export const CTAButton = ({ children, trackingName, href, className = '', ...props }: Omit<TrackedButtonProps, 'trackingLocation'>) => (
  <TrackedButton
    trackingName={trackingName}
    trackingLocation="cta"
    href={href}
    className={`bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </TrackedButton>
);

export const HeroButton = ({ children, trackingName, href, className = '', ...props }: Omit<TrackedButtonProps, 'trackingLocation'>) => (
  <TrackedButton
    trackingName={trackingName}
    trackingLocation="hero"
    href={href}
    className={`px-8 py-4 bg-cyan-500 text-white text-lg font-semibold rounded-lg hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </TrackedButton>
);

export const SecondaryButton = ({ children, trackingName, href, className = '', ...props }: Omit<TrackedButtonProps, 'trackingLocation'>) => (
  <TrackedButton
    trackingName={trackingName}
    trackingLocation="secondary"
    href={href}
    className={`px-8 py-4 border-2 border-slate-600 text-slate-600 text-lg font-semibold rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </TrackedButton>
);

export const NavigationButton = ({ children, trackingName, href, className = '', ...props }: Omit<TrackedButtonProps, 'trackingLocation'>) => (
  <TrackedButton
    trackingName={trackingName}
    trackingLocation="nav"
    href={href}
    className={`bg-cyan-500 text-white px-6 py-2.5 rounded-lg hover:bg-cyan-600 transition-colors font-semibold shadow-sm focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </TrackedButton>
);

export const DemoButton = ({ children, trackingName, onClick, className = '', ...props }: Omit<TrackedButtonProps, 'trackingLocation' | 'href'>) => (
  <TrackedButton
    trackingName={trackingName}
    trackingLocation="demo"
    onClick={onClick}
    className={`block w-full bg-cyan-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </TrackedButton>
);

export const CalculatorButton = ({ children, trackingName, onClick, className = '', type = 'button', ...props }: Omit<TrackedButtonProps, 'trackingLocation' | 'href'>) => (
  <TrackedButton
    trackingName={trackingName}
    trackingLocation="calculator"
    onClick={onClick}
    type={type}
    className={`bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </TrackedButton>
);

export default TrackedButton;
