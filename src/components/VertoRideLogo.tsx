import React from 'react';

interface VertoRideIconProps {
  size?: number;
  className?: string;
}

/**
 * VERTORIDE Icon:
 * An athletic, modern 'V' lettermark that seamlessly integrates:
 * 1. Converging dual road / highway perspective forming the arms of the 'V'
 * 2. Highway center dashed lane markings
 * 3. A dynamic car/transit silhouette driving forward along the road
 * 4. A destination beacon point on the pathway
 */
export const VertoRideIcon: React.FC<VertoRideIconProps> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="VERTORIDE Logo"
    >
      <defs>
        {/* Main Road V Gradient */}
        <linearGradient id="vrVGradient" x1="6" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />   {/* indigo-600 */}
          <stop offset="50%" stopColor="#6366F1" />  {/* indigo-500 */}
          <stop offset="100%" stopColor="#7C3AED" /> {/* purple-600 */}
        </linearGradient>

        {/* Highlight Gradient for Right Road Arm */}
        <linearGradient id="vrRightArm" x1="24" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>

        {/* Car Accent Gradient */}
        <linearGradient id="vrCarGlow" x1="17" y1="13" x2="31" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Shadow Filter */}
        <filter id="vrDropShadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1e1b4b" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#vrDropShadow)">
        {/* Outer bold 'V' Highway Road track */}
        <path
          d="M 6 7 
             L 16.5 7 
             L 24 25.5 
             L 31.5 7 
             L 42 7 
             L 27.8 42 
             C 26.5 45.2, 21.5 45.2, 20.2 42 
             Z"
          fill="url(#vrVGradient)"
        />

        {/* Inner highway road depth facet on right arm for 3D speed perspective */}
        <path
          d="M 31.5 7 
             L 42 7 
             L 27.8 42 
             C 26.5 45.2, 24.8 44.5, 24 42.5 
             L 24 25.5 
             Z"
          fill="url(#vrRightArm)"
          opacity="0.85"
        />

        {/* Highway road dashed center lines following the 'V' slope */}
        {/* Left lane dash upper */}
        <line
          x1="13"
          y1="13"
          x2="16.5"
          y2="21"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
          opacity="0.9"
        />
        {/* Left lane dash lower */}
        <line
          x1="18"
          y1="25"
          x2="21.5"
          y2="33"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
          opacity="0.9"
        />

        {/* Right lane dash upper */}
        <line
          x1="35"
          y1="13"
          x2="31.5"
          y2="21"
          stroke="#FCD34D"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
          opacity="0.8"
        />
        {/* Right lane dash lower */}
        <line
          x1="30"
          y1="25"
          x2="26.5"
          y2="33"
          stroke="#FCD34D"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
          opacity="0.8"
        />

        {/* Central Dynamic Car / Transit Vehicle Silhouette emerging forward at top-center */}
        <g transform="translate(0, 1)">
          {/* Car body */}
          <path
            d="M 18.5 21 
               C 18.5 17.5, 20 16, 24 16 
               C 28 16, 29.5 17.5, 29.5 21 
               L 30.5 23.5 
               C 31 24.5, 30.5 25.5, 29.5 25.5 
               L 18.5 25.5 
               C 17.5 25.5, 17 24.5, 17.5 23.5 
               Z"
            fill="#FFFFFF"
          />

          {/* Car Windshield */}
          <path
            d="M 20.2 20.2 
               C 20.5 17.8, 21.5 17.2, 24 17.2 
               C 26.5 17.2, 27.5 17.8, 27.8 20.2 
               Z"
            fill="#1E1B4B"
          />

          {/* Headlights (twin amber/gold beams illuminating the road ahead) */}
          <circle cx="19.5" cy="24" r="1.1" fill="#FBBF24" />
          <circle cx="28.5" cy="24" r="1.1" fill="#FBBF24" />

          {/* Lower grille accent */}
          <line x1="22" y1="24.2" x2="26" y2="24.2" stroke="#6366F1" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Campus destination pin / beacon dot hovering at the road destination apex */}
        <circle cx="24" cy="9.5" r="2.2" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
      </g>
    </svg>
  );
};

interface VertoRideLogoProps {
  size?: number;
  className?: string;
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const VertoRideLogo: React.FC<VertoRideLogoProps> = ({
  size = 36,
  className = '',
  showSubtitle = true,
  inverted = false
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic V-Road-Car Mark */}
      <div className="relative shrink-0 transition-transform duration-200 group-hover:scale-105">
        <VertoRideIcon size={size} />
      </div>

      {/* Brand Text */}
      <div className="shrink-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${
              size >= 40 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            } ${inverted ? 'text-white' : 'text-slate-900'}`}
          >
            VERTO<span className="text-indigo-600 font-extrabold">RIDE</span>
          </span>

          <span className="inline-block text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
            LPU Campus
          </span>
        </div>

        {showSubtitle && (
          <p
            className={`text-[10px] sm:text-[11px] font-medium tracking-normal mt-1 ${
              inverted ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            LPU Student Carpooling & Campus Ride Pool
          </p>
        )}
      </div>
    </div>
  );
};
