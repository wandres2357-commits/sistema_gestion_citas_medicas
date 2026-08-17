export default function Logo({
  size = 64,
  className = "",
  showPulse = true,
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Gradiente institucional */}
        <linearGradient id="sgcm-g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1976d2" />
          <stop offset="100%" stopColor="#42a5f5" />
        </linearGradient>

        {/* Luz superior */}
        <radialGradient id="sgcm-light" cx="30%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        {/* Glow */}
        <filter id="sgcm-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Sombra */}
        <filter id="sgcm-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Fondo */}
      <circle cx="32" cy="32" r="28" fill="url(#sgcm-g1)" />
      <circle cx="32" cy="32" r="28" fill="url(#sgcm-light)" />

      {/* Sombra cruz */}
      <path
        d="M30 21 a3 3 0 0 1 6 0 v9 h9 a3 3 0 0 1 0 6 h-9 v9 a3 3 0 0 1 -6 0 v-9 h-9 a3 3 0 0 1 0 -6 h9 z"
        fill="rgba(0,0,0,0.25)"
      />

      {/* Cruz */}
      <path
        d="M29 20 a3 3 0 0 1 6 0 v9 h9 a3 3 0 0 1 0 6 h-9 v9 a3 3 0 0 1 -6 0 v-9 h-9 a3 3 0 0 1 0 -6 h9 z"
        fill="var(--accent)"
        filter="url(#sgcm-shadow)"
      />

      {/* Pulso (opcional) */}
      {showPulse && (
        <>
          <path
            d="M22 32 L26 32 L28 26 L30 38 L32 28 L34 38 L36 26 L38 32 L42 32"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="70"
            strokeDashoffset="70"
            filter="url(#sgcm-glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="70;0"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </path>

          <path
            d="M22 32 L26 32 L28 26 L30 38 L32 28 L34 38 L36 26 L38 32 L42 32"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </path>
        </>
      )}
    </svg>
  );
}