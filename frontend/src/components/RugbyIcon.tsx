interface RugbyIconProps {
  className?: string;
}

export const RugbyIcon = ({ className = "w-8 h-8" }: RugbyIconProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rugby Ball */}
      <ellipse
        cx="32"
        cy="32"
        rx="18"
        ry="26"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Stitching lines */}
      <path
        d="M 32 10 L 32 54"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M 26 32 L 38 32"
        stroke="white"
        strokeWidth="2"
        opacity="0.9"
      />

      {/* Cross laces */}
      <line x1="26" y1="28" x2="29" y2="28" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="35" y1="28" x2="38" y2="28" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="26" y1="32" x2="29" y2="32" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="35" y1="32" x2="38" y2="32" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="26" y1="36" x2="29" y2="36" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="35" y1="36" x2="38" y2="36" stroke="white" strokeWidth="1" opacity="0.7" />

      {/* Whistle attached to ball */}
      <g transform="translate(42, 22)">
        {/* Whistle body */}
        <rect x="0" y="0" width="12" height="8" rx="2" fill="#FFD700" />
        <rect x="2" y="2" width="8" height="4" rx="1" fill="#FFA500" />

        {/* Whistle holes */}
        <circle cx="4" cy="4" r="0.8" fill="#FFD700" />
        <circle cx="6" cy="4" r="0.8" fill="#FFD700" />
        <circle cx="8" cy="4" r="0.8" fill="#FFD700" />

        {/* Mouthpiece */}
        <rect x="12" y="2" width="4" height="4" rx="1" fill="#FFD700" />

        {/* Sound waves */}
        <path
          d="M 2 -2 Q 0 -4, -2 -6"
          stroke="#4AAFF7"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 4 -3 Q 2 -5, 0 -8"
          stroke="#4AAFF7"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </g>
    </svg>
  );
};
