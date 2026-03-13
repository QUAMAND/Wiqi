import { ReactNode, useState } from "react";
import styled, { css } from "styled-components";

import { Badge } from "../common/Badge";
import { Icon, IconKeys } from "../common/Icon";
import { Page } from "./Item";

const Style = styled.button<{ $open: boolean; $color?: string; $glow?: string }>`
  position: relative;
  overflow: hidden;
  width: calc(100% - 7px);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--bg-stone);
  border: 1px solid var(--bg-hover);
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 1px;
  transition: background var(--transition);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${p => p.$glow ?? "transparent"};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 200ms ease-out;
  }
  &:hover::before { transform: scaleX(1); }

  ${p => p.$open && css`
    border-left: 3px solid ${p.$color};
    box-shadow: ${p.$glow};
  `}
`
const Text = styled.span<{ $fontSize: string }>`
  white-space: nowrap;
  font-size: ${p => p.$fontSize};
  color: var(--text-content);
`
const DropIcon = styled(Icon)<{ $open: boolean }>`
  transition: transform 300ms var(--bound);
  transform: ${p => p.$open ? "rotate(180deg)" : "rotate(0deg)"};
`
const StyledBadge = styled(Badge)`margin-left: auto;`

const Items = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${p => p.$open ? "100%" : "0"};
  transition: ${p => p.$open ? "max-height .3s ease-in" : "max-height .1s var(--bound)"};
`

interface Props {
  text: string;
  icon?: IconKeys;
  count?: number;
  color?: string;
  glow?: string;
  fontSize?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Group({ text, icon, count, color, glow, fontSize = "1rem", children, onClick, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Style $open={open} $color={color} $glow={glow} className={className}
        onClick={() => { setOpen((v) => !v); onClick?.(); }}>
        {icon && <Icon size={24} color={color} icon={icon} />}
        <Text $fontSize={fontSize}>{text}</Text>
        {count && <StyledBadge badge={count} />}
        <DropIcon icon="dropdown" size={20} $open={open} />
      </Style>
      <Items $open={open}>
        {children}
      </Items>
    </>
  );
}

/** 그룹 하위 페이지 수 계산 */
export function CountingChildren(pages: Page[]): number {
  const files = new Set<string>();
  function walk(entries: Page[]) {
    for (const entry of entries) {
      if (entry.file) files.add(entry.file);
      if (entry.children) walk(entry.children);
    }
  }
  walk(pages);
  return files.size;
}