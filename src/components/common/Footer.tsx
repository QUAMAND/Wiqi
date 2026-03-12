import { Dot, DotColor } from "./Dot";
import styled from "styled-components";

const Style = styled.div`
  cursor: pointer;
  flex-shrink: 0;
  padding: 8px 15px 4px;
  background-color: var(--bg-deep);
`
const Inner = styled.span`
  font-family: "code";
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
`

interface Props {
  text: string;
  color?: DotColor;
  className?: string;
}

export function Footer({ text, color = "green", className = "" }: Props) {
  return (
    <Style className={`Footer ${className}`}>
      <Inner className="Footer-inner">
        <Dot dot={color} />
        {text}
      </Inner>
    </Style>
  );
}
