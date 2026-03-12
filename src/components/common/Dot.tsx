import styled from "styled-components";

export type DotColor = "gray" | "red" | "orange" | "gold" | "green" | "blue" | "purple";

const colors: Record<DotColor, string> = {
  gray:   "var(--text-second)",
  red:    "var(--accent-red)",
  orange: "var(--accent-orange)",
  gold:   "var(--accent-gold)",
  green:  "var(--accent-green)",
  blue:   "var(--accent-blue)",
  purple: "var(--accent-purple)",
};

const Style = styled.span<{ $color: string; $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  background: ${(p) => p.$color};
  box-shadow: 0 0 5px ${(p) => p.$color};
  border-radius: 50%;
  flex-shrink: 0;
`;

interface Props {
  dot?: DotColor;
  size?: number;
  className?: string;
}

export function Dot({ dot = "gray", size = 6, className = "" }: Props) {
  return <Style $color={colors[dot]} $size={size} className={`Dot Dot-${dot} ${className}`} />;
}