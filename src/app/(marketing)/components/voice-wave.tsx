/* Brand accent — vibrant Iris purple used across both marketing and dashboard */
const IRIS = "#5b5ef4";

interface VoiceWaveProps {
  size?: number;
  /** default = iris bubble + white wave; rev = white bubble + ink wave; iris = white bubble + accent wave */
  variant?: "default" | "rev" | "iris";
  animated?: boolean;
  className?: string;
}

export function VoiceWave({
  size = 34,
  variant = "default",
  animated = false,
  className = "",
}: VoiceWaveProps) {
  const bubbleFill =
    variant === "rev" ? "#ffffff"
    : variant === "iris" ? "#ffffff"
    : IRIS;

  const waveFill =
    variant === "rev" ? "currentColor"
    : variant === "iris" ? IRIS
    : "#ffffff";

  const animClass = animated ? "vmark--live" : "";
  const cls = ["vmark", animClass, className].filter(Boolean).join(" ");

  return (
    <svg
      className={cls}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect fill={bubbleFill} x="14" y="16" width="72" height="52" rx="18" />
      <path fill={bubbleFill} d="M30 58 L26 82 L52 62 Z" />
      <g fill={waveFill}>
        <rect x="29.5" y="36" width="5" height="12" rx="2.5" />
        <rect x="38.5" y="31" width="5" height="22" rx="2.5" />
        <rect x="47.5" y="26" width="5" height="32" rx="2.5" />
        <rect x="56.5" y="31" width="5" height="22" rx="2.5" />
        <rect x="65.5" y="36" width="5" height="12" rx="2.5" />
      </g>
    </svg>
  );
}
