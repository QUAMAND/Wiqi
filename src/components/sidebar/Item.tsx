import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { Badge, Badges } from "../common/Badge";
import { Icon, IconKeys } from "../common/Icon";
import { PageState } from "../../types";

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

  ${p => p.$select && css`border-left: 3px solid var(--text-content);`}

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--bg-bright-alpha);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 200ms ease-out;
  }

  &:hover::before { transform: scaleX(1); }
`

const Text = styled.span<{ $fontSize?: string; $color?: string }>`
  font-size: ${p => p.$fontSize ?? "13px"};
  color: ${p => p.$color ?? "var(--text-second)"};
`

const StyledBadge = styled(Badge)`margin-left: auto;`

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
  children?: ReactNode;
}

export function Item({ text, icon, badge, select = false, depth = 0, fontSize, textColor, onClick, className = "", children }: Props) {
  const iconSize = children ? 13 : 15;
  return (
    <div style={{ marginLeft: "12px" }}>
      <Style $select={select} $depth={depth} className={className} onClick={onClick}>
        {icon && <Icon size={iconSize} icon={icon} />}
        <Text $fontSize={fontSize} $color={textColor}>{text}</Text>
        {badge !== undefined && <StyledBadge badge={badge} />}
      </Style>
      {children && <div>{children}</div>}
    </div>
  );
}

/** 아이템 뿌리기 */
export interface Page {
  url: string;
  title: string;
  subtitle?: string;
  file?: string;
  children?: Page[];
}

interface OperProps {
  docs: Page[];
  page: PageState;
  onSelect: (state: PageState) => void;
}

export function OperPages({ docs, page, onSelect }: OperProps) {
  return <>{docs.map(e => render(e, page, onSelect))}</>;
}

function render(entry: Page, page: PageState, onSelect: (state: PageState) => void, depth = 0): React.ReactNode {
  return (
    <div key={entry.url}>
      <Item
        icon="markdown"
        text={entry.title}
        depth={depth}
        select={page.file === entry.file}
        onClick={entry.file ? () => onSelect({ type: "markdown", url: entry.url, file: entry.file }) : undefined}
        textColor={depth === 0 ? "var(--text-accent)" : "var(--text-content)"}
      />
      {entry.children?.map((child) => render(child, page, onSelect, depth + 1))}
    </div>
  );
}