import "./index.css";

interface Props {
  dot?: string;
  size?: number;
  className?: string;
}

export function Dot({ dot = "gray", size = 6, className = "" }: Props) {
  return (
    <span
      className={`Dot Dot-${dot} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        flexShrink: 0,
      }}
    />
  );
}
