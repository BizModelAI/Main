import React from 'react';
import logoSvg from '@/assets/logo.svg';

interface BizModelAILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const BizModelAILogo: React.FC<BizModelAILogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo using your exact design */}
      <img 
        src={logoSvg} 
        alt="BizModelAI Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
      
      {/* Brand Text */}
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          BizModelAI
        </span>
      )}
    </div>
  );
};

export default BizModelAILogo;