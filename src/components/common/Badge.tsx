import styled, { css } from "styled-components";

const styles = {
  new:     css`background: var(--accent-green-dim);  color: var(--accent-green);  border: 1px solid var(--accent-glow-green);`,
  version: css`background: var(--accent-purple-dim); color: var(--accent-purple); border: 1px solid var(--accent-glow-purple);`,
  warn:    css`background: var(--accent-orange-dim); color: var(--accent-orange); border: 1px solid var(--accent-glow-orange);`,
  tip:     css`background: var(--accent-blue-dim);   color: var(--accent-blue);   border: 1px solid var(--accent-glow-blue);`,
  number:  css`background: var(--accent-gold-dim);   color: var(--accent-gold);   border: 1px solid var(--accent-glow-gold);`,
};

const Style = styled.span<{ $type: Badges }>`
  width: fit-content;
  padding: 1px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  user-select: none;
  font-family: "code";

  ${(p) => styles[typeof p.$type === "number" ? "number" : p.$type]}
`;

export type Badges = "new" | "version" | "warn" | "tip" | number;
interface Props {
  badge: Badges;
  className?: string;
}

export function Badge({ badge, className = "" }: Props) {
  return <Style $type={badge} className={`Badge ${className}`}>{badge}</Style>;
}