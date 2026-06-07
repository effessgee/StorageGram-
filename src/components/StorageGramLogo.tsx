import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

export function StorageGramLogo({ className = '', size = 'md', style }: LogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={style}>
      {/* Radiant Glowing Aura Backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-cyan-500/25 via-indigo-500/10 to-emerald-400/25 blur-lg rounded-full animate-pulse`} />
      
      {/* Precision Handcrafted Brand Svg */}
      <svg
        className={`${sizeClasses[size]} relative drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gradient Definitions */}
          <linearGradient id="cloudGrad" x1="10" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-405 */}
            <stop offset="50%" stopColor="#6366f1" /> {/* indigo-505 */}
            <stop offset="100%" stopColor="#34d399" /> {/* emerald-405 */}
          </linearGradient>
          
          <linearGradient id="planeGrad" x1="30" y1="30" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#818cf8" /> {/* light indigo */}
          </linearGradient>

          <linearGradient id="glowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Circular Tech Ring with segment accents */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          stroke="url(#glowGrad)" 
          strokeWidth="1.5" 
          strokeDasharray="14 6 4 6"
          className="animate-spin"
          style={{ animationDuration: '40s' }}
        />
        
        {/* Secondary inner ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="41" 
          stroke="rgba(99, 102, 241, 0.15)" 
          strokeWidth="1" 
          strokeDasharray="2 4"
        />

        {/* Abstract Cloud Vector Grid Base */}
        <path
          d="M32 68 C18 68, 12 56, 22 46 C18 30, 36 18, 50 26 C62 16, 80 22, 78 38 C90 44, 88 62, 74 66 C70 68, 32 68, 32 68 Z"
          fill="none"
          stroke="url(#cloudGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow)"
          className="opacity-90"
        />
        
        {/* Subtle inner accent glass fill represention */}
        <path
          d="M32 68 C18 68, 12 56, 22 46 C18 30, 36 18, 50 26 C62 16, 80 22, 78 38 C90 44, 88 62, 74 66 Z"
          fill="rgba(15, 23, 42, 0.45)"
          className="backdrop-blur-sm"
        />

        {/* Sleek Forward-Slanting Paper Plane Speeding Core */}
        <g transform="translate(4, -4) scale(0.92)" filter="url(#shadow)">
          {/* Main Paper Plane Body Fold */}
          <path
            d="M26 51 L74 24 L56 62 L48 53 L26 51 Z"
            fill="url(#planeGrad)"
          />
          
          {/* Shadow/Contrast Flight Wing Fold */}
          <path
            d="M74 24 L48 53 L51 68 L56 62 L74 24 Z"
            fill="rgba(30, 41, 59, 0.35)"
          />
          
          {/* Plane Core Center Fold Line */}
          <path
            d="M74 24 L48 53"
            stroke="#4338ca"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>

        {/* Decorative Particle Sparks representing High-Volume Bytes */}
        <circle cx="20" cy="38" r="2.5" fill="#34d399" className="animate-pulse" />
        <circle cx="82" cy="55" r="2" fill="#22d3ee" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        <circle cx="58" cy="18" r="1.5" fill="#818cf8" className="animate-pulse" style={{ animationDelay: '1s' }} />
      </svg>
    </div>
  );
}

export function StorageGramBrandingCard() {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950/80 border border-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <StorageGramLogo size="lg" className="animate-bounce" style={{ animationDuration: '3s' }} />
      
      <div className="space-y-1.5 select-none">
        <h2 className="text-xl font-black tracking-widest text-white uppercase font-sans">
          Storage<span className="text-cyan-400">Gram</span>
        </h2>
        <span className="inline-flex text-[9px] font-bold px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-950 rounded-xl tracking-wider uppercase">
          Authorized Cloud Interface
        </span>
      </div>
      
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-sans">
        StorageGram leverages secure API transport layers to offer unlimited and free cloud storage. File chunks are protected with client-side end-to-end encryption.
      </p>
    </div>
  );
}
