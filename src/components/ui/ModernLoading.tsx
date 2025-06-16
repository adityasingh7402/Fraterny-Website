import React from 'react';
import { cn } from '@/lib/utils';

interface ModernLoadingProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'minimal';
}

const ModernLoading: React.FC<ModernLoadingProps> = ({ 
  message = "We're bringing you something better...",
  className,
  variant = 'default'
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[50vh] px-4",
      variant === 'default' && "bg-white",
      className
    )}>
      {/* Animated Dots */}
      <div className="flex space-x-2 mb-6">
        <div 
          className="w-3 h-3 bg-terracotta rounded-full animate-pulse"
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        />
        <div 
          className="w-3 h-3 bg-terracotta rounded-full animate-pulse"
          style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
        />
        <div 
          className="w-3 h-3 bg-terracotta rounded-full animate-pulse"
          style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
        />
      </div>

      {/* Loading Text */}
      <div className="text-center animate-fade-in">
        <p className="text-lg sm:text-xl text-navy font-medium mb-2">
          {message}
        </p>
        <div className="w-12 h-0.5 bg-terracotta mx-auto opacity-60" />
      </div>
    </div>
  );
};

// Loading variants for different contexts
export const PageLoading = () => (
  <ModernLoading message="We're bringing you something better..." />
);

export const HeroLoading = () => (
  <ModernLoading 
    message="Crafting your experience..." 
    className="min-h-screen bg-navy text-white"
  />
);

export const AdminLoading = () => (
  <ModernLoading 
    message="Preparing your dashboard..." 
    className="bg-gray-50"
  />
);

export default ModernLoading;