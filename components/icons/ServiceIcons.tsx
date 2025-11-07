// Custom SVG icons for services following Make Ready brand guide
// Colors: Purple #2F2F72 and Gold #D4AF37

interface IconProps {
  className?: string;
}

export const ProgramManagementIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="16" width="48" height="40" rx="2" fill="#2F2F72" />
    <rect x="12" y="24" width="16" height="2" fill="#D4AF37" />
    <rect x="12" y="30" width="16" height="2" fill="#D4AF37" />
    <rect x="12" y="36" width="16" height="2" fill="#D4AF37" />
    <rect x="32" y="24" width="20" height="8" rx="1" fill="#D4AF37" />
    <rect x="32" y="36" width="20" height="8" rx="1" fill="#D4AF37" />
    <path d="M20 10 L32 4 L44 10 L32 16 Z" fill="#D4AF37" />
    <circle cx="48" cy="14" r="6" fill="#D4AF37" />
    <path d="M48 11 L46 15 L50 15 Z" fill="#2F2F72" />
  </svg>
);

export const AIIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="24" fill="#2F2F72" />
    <circle cx="32" cy="32" r="16" stroke="#D4AF37" strokeWidth="2" fill="none" />
    <circle cx="32" cy="32" r="8" fill="#D4AF37" />
    <circle cx="20" cy="20" r="3" fill="#D4AF37" />
    <circle cx="44" cy="20" r="3" fill="#D4AF37" />
    <circle cx="44" cy="44" r="3" fill="#D4AF37" />
    <circle cx="20" cy="44" r="3" fill="#D4AF37" />
    <line x1="23" y1="23" x2="29" y2="29" stroke="#D4AF37" strokeWidth="2" />
    <line x1="35" y1="29" x2="41" y2="23" stroke="#D4AF37" strokeWidth="2" />
    <line x1="35" y1="35" x2="41" y2="41" stroke="#D4AF37" strokeWidth="2" />
    <line x1="23" y1="41" x2="29" y2="35" stroke="#D4AF37" strokeWidth="2" />
  </svg>
);

export const GeospatialIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="26" fill="#2F2F72" />
    <ellipse cx="32" cy="32" rx="26" ry="13" stroke="#D4AF37" strokeWidth="2" fill="none" />
    <ellipse cx="32" cy="32" rx="13" ry="26" stroke="#D4AF37" strokeWidth="2" fill="none" />
    <line x1="6" y1="32" x2="58" y2="32" stroke="#D4AF37" strokeWidth="2" />
    <circle cx="32" cy="32" r="4" fill="#D4AF37" />
    <path d="M32 8 L35 16 L32 14 L29 16 Z" fill="#D4AF37" />
    <path d="M32 56 L35 48 L32 50 L29 48 Z" fill="#D4AF37" />
    <path d="M8 32 L16 29 L14 32 L16 35 Z" fill="#D4AF37" />
    <path d="M56 32 L48 29 L50 32 L48 35 Z" fill="#D4AF37" />
  </svg>
);

export const ITSupportIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="10" y="10" width="44" height="32" rx="2" fill="#2F2F72" />
    <rect x="14" y="14" width="36" height="20" fill="#D4AF37" opacity="0.3" />
    <rect x="26" y="42" width="12" height="4" fill="#2F2F72" />
    <rect x="20" y="46" width="24" height="2" rx="1" fill="#2F2F72" />
    <circle cx="32" cy="24" r="6" fill="#D4AF37" />
    <path d="M29 24 L31 26 L35 22" stroke="#2F2F72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="18" y="36" width="8" height="2" rx="1" fill="#D4AF37" />
    <rect x="38" y="36" width="8" height="2" rx="1" fill="#D4AF37" />
  </svg>
);

export const DataAnalyticsIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="8" width="48" height="48" rx="2" fill="#2F2F72" />
    <rect x="14" y="38" width="8" height="14" fill="#D4AF37" />
    <rect x="26" y="28" width="8" height="24" fill="#D4AF37" />
    <rect x="38" y="20" width="8" height="32" fill="#D4AF37" />
    <path d="M18 32 L30 24 L42 16" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="32" r="2" fill="#D4AF37" />
    <circle cx="30" cy="24" r="2" fill="#D4AF37" />
    <circle cx="42" cy="16" r="2" fill="#D4AF37" />
    <path d="M50 14 L54 10 M50 14 L54 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CorporateSupportIcon = ({ className = "w-16 h-16" }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="12" y="16" width="40" height="40" rx="2" fill="#2F2F72" />
    <rect x="20" y="8" width="24" height="12" rx="1" fill="#D4AF37" />
    <rect x="18" y="24" width="8" height="8" fill="#D4AF37" opacity="0.6" />
    <rect x="28" y="24" width="8" height="8" fill="#D4AF37" opacity="0.6" />
    <rect x="38" y="24" width="8" height="8" fill="#D4AF37" opacity="0.6" />
    <rect x="18" y="34" width="8" height="8" fill="#D4AF37" opacity="0.6" />
    <rect x="28" y="34" width="8" height="8" fill="#D4AF37" opacity="0.6" />
    <rect x="38" y="34" width="8" height="8" fill="#D4AF37" opacity="0.6" />
    <rect x="18" y="44" width="28" height="8" fill="#D4AF37" />
  </svg>
);

