// Custom Veteran Owned icon following Make Ready brand guide
// Colors: Purple #2F2F72 and Gold #D4AF37

interface VeteranIconProps {
  className?: string;
}

export const VeteranIcon = ({ className = "w-full h-full" }: VeteranIconProps) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Circle */}
    <circle cx="200" cy="200" r="180" fill="#2F2F72" />
    
    {/* Star (5-pointed) */}
    <path
      d="M200 80 L220 150 L290 150 L235 190 L255 260 L200 220 L145 260 L165 190 L110 150 L180 150 Z"
      fill="#D4AF37"
      stroke="#F4D479"
      strokeWidth="3"
    />
    
    {/* Shield Outline */}
    <path
      d="M120 140 L120 220 Q120 280, 200 320 Q280 280, 280 220 L280 140 L200 120 Z"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Eagle Wings (Stylized) */}
    <path
      d="M160 200 Q140 180, 120 200"
      stroke="#D4AF37"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M240 200 Q260 180, 280 200"
      stroke="#D4AF37"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Stripes (representing flag) */}
    <line x1="150" y1="240" x2="250" y2="240" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
    <line x1="150" y1="250" x2="250" y2="250" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
    <line x1="150" y1="260" x2="250" y2="260" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
    <line x1="150" y1="270" x2="250" y2="270" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
    
    {/* Accent Circles (Military Rank Inspired) */}
    <circle cx="200" cy="290" r="4" fill="#D4AF37" />
    <circle cx="185" cy="290" r="3" fill="#D4AF37" opacity="0.8" />
    <circle cx="215" cy="290" r="3" fill="#D4AF37" opacity="0.8" />
    
    {/* Text Path for "VETERAN OWNED" */}
    <text
      x="200"
      y="350"
      fontFamily="sans-serif"
      fontSize="16"
      fontWeight="bold"
      fill="#D4AF37"
      textAnchor="middle"
      letterSpacing="3"
    >
      VETERAN OWNED
    </text>
  </svg>
);

export const VeteranBadge = ({ className = "w-full h-full" }: VeteranIconProps) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Circle */}
    <circle cx="200" cy="200" r="190" fill="#2F2F72" />
    <circle cx="200" cy="200" r="180" fill="none" stroke="#D4AF37" strokeWidth="8" />
    
    {/* Inner Star Badge */}
    <circle cx="200" cy="200" r="120" fill="#D4AF37" opacity="0.2" />
    
    {/* Large 5-Point Star */}
    <path
      d="M200 100 L225 165 L295 165 L240 205 L265 270 L200 230 L135 270 L160 205 L105 165 L175 165 Z"
      fill="#D4AF37"
      stroke="#F4D479"
      strokeWidth="4"
    />
    
    {/* Center Shield */}
    <path
      d="M160 180 L160 220 Q160 250, 200 270 Q240 250, 240 220 L240 180 L200 170 Z"
      fill="#2F2F72"
      stroke="#D4AF37"
      strokeWidth="3"
    />
    
    {/* Service Stripes */}
    <line x1="180" y1="210" x2="220" y2="210" stroke="#D4AF37" strokeWidth="3" />
    <line x1="180" y1="220" x2="220" y2="220" stroke="#D4AF37" strokeWidth="3" />
    <line x1="180" y1="230" x2="220" y2="230" stroke="#D4AF37" strokeWidth="3" />
    
    {/* Top Text Arc */}
    <text
      x="200"
      y="70"
      fontFamily="sans-serif"
      fontSize="22"
      fontWeight="bold"
      fill="#D4AF37"
      textAnchor="middle"
      letterSpacing="4"
    >
      VETERAN
    </text>
    
    {/* Bottom Text Arc */}
    <text
      x="200"
      y="340"
      fontFamily="sans-serif"
      fontSize="22"
      fontWeight="bold"
      fill="#D4AF37"
      textAnchor="middle"
      letterSpacing="4"
    >
      OWNED & OPERATED
    </text>
    
    {/* Corner Stars */}
    <circle cx="80" cy="80" r="6" fill="#D4AF37" />
    <circle cx="320" cy="80" r="6" fill="#D4AF37" />
    <circle cx="80" cy="320" r="6" fill="#D4AF37" />
    <circle cx="320" cy="320" r="6" fill="#D4AF37" />
  </svg>
);

