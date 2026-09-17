import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm tracking-[0.25em]' },
    md: { icon: 'w-8 h-8', text: 'text-lg tracking-[0.28em]' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl tracking-[0.3em]' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl tracking-[0.32em]' },
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  const IconSVG = (
    <svg
      className={`${iconSize} shrink-0 transition-transform duration-300 group-hover:scale-105`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e82127" />
          <stop offset="100%" stopColor="#ff4d4d" />
        </linearGradient>
        <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#8e9bb0" />
        </linearGradient>
      </defs>

      {/* Dynamic Aerospace Orbit / Speed Arc */}
      <path
        d="M 6 36 C 14 18, 28 8, 42 12 C 34 22, 22 28, 12 38 Z"
        fill="url(#steelGrad)"
        opacity="0.85"
      />

      {/* Electric Forward Vector Chevron */}
      <path
        d="M 18 38 L 40 14 L 32 14 L 14 34 Z"
        fill="url(#brandGrad)"
      />

      {/* Precision Core Node */}
      <circle cx="38" cy="14" r="3" fill="#ffffff" />
      <circle cx="38" cy="14" r="5" stroke="#e82127" strokeWidth="1" opacity="0.8" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {IconSVG}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 group ${className}`}>
      {IconSVG}
      <div className="flex flex-col">
        <span className={`font-black uppercase text-white ${textSize} leading-none transition-colors group-hover:text-white`}>
          Tesla <span className="text-[#e82127] font-semibold">&</span> Spacex
        </span>
        {showTagline && (
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/50 mt-1">
            Future Mobility & Aerospace
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
