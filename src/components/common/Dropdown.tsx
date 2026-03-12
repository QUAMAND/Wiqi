import { useState } from "react";
import styled from "styled-components";

import { Dot } from "./Dot";
import { Icon, IconKeys } from "./Icon";

const Style = styled.div`
  position: relative;
`
const DropdownButton = styled.button`
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  height: 32px;
  background: var(--bg-cave);
  border: 1px solid var(--l-dim);
  border-radius: var(--radius-m);
  color: var(--text-content);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--bg-raised);
    border-color: var(--l-sub);
    color: var(--text-content);
  }
`
const DropdownList = styled.ul`
  position: absolute;
  padding-inline-start: 0;
  width: 100%;
  top: calc(100% + 4px);
  background: var(--bg-stone);
  border: 1px solid var(--l-sub);
  border-radius: var(--radius-m);
  list-style: none;
  overflow: hidden;
  z-index: 200;
`
const DropdownItem = styled.button<{ $select?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px;
  background: transparent;
  border: none;
  color: ${p => p.$select ? "var(--accent-green)" : "var(--text-second)"};
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--bg-hover);
    color: var(--text-content);
  }

  ${p => !p.$select && `
    &:hover .Dot {
      background: var(--accent-glow-green);
      box-shadow: 0 0 5px var(--accent-green-dim);
    }
  `}
`

interface Item {
  key: string;
  value: string;
}

interface Props {
  icon?: IconKeys;
  value: string;
  items: Item[];
  onSelect?: (value: string) => void;
}

export function Dropdown({ icon, value, items, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const selected = items.find(i => i.key === value) || items[0];

  return (
    <Style>
      <DropdownButton onClick={() => setOpen((v) => !v)}>
        {icon && <Icon size={16} icon={icon} />}
        {selected?.value}
        <Icon
          icon="dropdown"
          size={16}
          style={{
            transition: "transform 300ms var(--bound)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </DropdownButton>

      {open && (
        <DropdownList>
          {items.map((item) => (
            <li key={item.key}>
              <DropdownItem
                $select={item.key === selected?.key}
                onClick={() => {
                  onSelect?.(item.key);
                  setOpen(false);
                }}
              >
                <Dot className="Dot" dot={item.key === selected?.key ? "green" : "gray"} />
                {item.value}
              </DropdownItem>
            </li>
          ))}
        </DropdownList>
      )}
    </Style>
  );
}