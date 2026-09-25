import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  variant?: 'mark' | 'full';
  brandName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 36,
  className = '',
  variant = 'mark',
  brandName = 'DocuMorph',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Precision Geometric Vector Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm select-none"
      >
        <defs>
          <linearGradient id="docuGradMain" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <linearGradient id="docuGradFold" x1="28" y1="8" x2="40" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>

          <linearGradient id="docuGradSheetBack" x1="12" y1="4" x2="44" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background secondary sheet (representing multi-document morphing & conversion) */}
        <path
          d="M14 6C14 4.89543 14.8954 4 16 4H34L44 14V34C44 35.1046 43.1046 36 42 36H16C14.8954 36 14 35.1046 14 34V6Z"
          fill="url(#docuGradSheetBack)"
          opacity="0.6"
        />

        {/* Foreground Primary Sheet */}
        <path
          d="M8 12C8 9.79086 9.79086 8 12 8H28L40 20V40C40 42.2091 38.2091 44 36 44H12C9.79086 44 8 42.2091 8 40V12Z"
          fill="url(#docuGradMain)"
        />

        {/* Folded Top-Right Corner */}
        <path
          d="M28 8L40 20H32C29.7909 20 28 18.2091 28 16V8Z"
          fill="url(#docuGradFold)"
          opacity="0.9"
        />

        {/* Dynamic Inner Symbol: Document Lines & Transformation Arrow */}
        <rect x="14" y="24" width="12" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.9" />
        <rect x="14" y="29.5" width="18" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.75" />
        <rect x="14" y="35" width="15" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.6" />

        {/* Central conversion loop dot / accent */}
        <circle cx="33" cy="35" r="2.5" fill="#ffffff" />
      </svg>

      {variant === 'full' && (
        <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
          <span>{brandName}</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            PDF
          </span>
        </span>
      )}
    </div>
  );
};
