import styled, { css } from "styled-components";

import { Badge, Badges } from "../common/Badge";
import { Icon, IconKeys } from "../common/Icon";

const Style = styled.button<{ $select?: boolean; $depth: number }>`
  position: relative;
  overflow: hidden;
  width: calc(100% - 20px);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: ${p => p.$select ? "var(--bg-white-alpha)" : "transparent"};
  border: 1px solid var(--bg-hover);
  cursor: pointer;
  border-radius: 16px;
  margin-bottom: 1px;
  margin-left: ${p => p.$depth * 12}px;
  transition: all .2s;

  ${p => p.$select && css`
    border-left: 3px solid var(--text-content);
  `}

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--bg-bright-alpha);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 200ms ease-out;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`
const Text = styled.span<{ $fontSize?: string; $color?: string }>`
  font-size: ${p => p.$fontSize ?? "13px"};
  color: ${p => p.$color ?? "var(--text-second)"};
`
const StyledBadge = styled(Badge)`
  margin-left: auto;
`

interface Props {
  text: string;
  icon?: IconKeys;
  badge?: Badges;
  select?: boolean;
  depth?: number;
  fontSize?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
}

export function Item({
  text,
  icon,
  badge,
  select = false,
  depth = 0,
  fontSize,
  textColor,
  onClick,
  className = "",
}: Props) {
  return (
    <Style $select={select} $depth={depth} className={className} onClick={onClick}>
      {icon && <Icon size={13} icon={icon} />}

      <Text $fontSize={fontSize} $color={textColor}>{text}</Text>

      {badge !== undefined && <StyledBadge badge={badge} />}
    </Style>
  );
}