interface Props {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Line({width = 1, height = 36, color = "var(--l-dim)", className = ""}: Props) {
  return (
    <div
      className={`Line ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `${color}`,
        flexShrink: 0,
      }}
    />
  );
}
