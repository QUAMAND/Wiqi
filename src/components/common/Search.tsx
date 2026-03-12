import { useEffect, useRef } from "react";
import styled from "styled-components";

import { Icon } from "./Icon";
import { Tooltip } from "./Tooltip";

const Style = styled.div`
  width: 300px;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 9px;
  background: var(--bg-cave);
  border: 1px solid var(--l-dim);
  border-radius: var(--radius-m);
  transition: border-color var(--transition), box-shadow var(--transition);

  &:focus-within {
    border-color: var(--l-act);
  }
`
const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-size: 12px;
  color: var(--text-content);

  &::placeholder {
    color: var(--text-muted);
  }
`
const Hotkey = styled.span`
  font-size: 8px;
  user-select: none;
  cursor: help;
  padding: 1px 4px;
  border: 1px solid var(--l-sub);
  border-radius: var(--radius-m);
  background: var(--bg-raised);
  color: var(--text-second);
`

interface Props {
  text?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function Search({ text, className = "", onSearch }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlash = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        ref.current?.focus();
      }
    }

    window.addEventListener("keydown", handleSlash);
    return () => window.removeEventListener("keydown", handleSlash)
  }, [])

  /** 검색 기능 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      onSearch?.(e.currentTarget.value.trim());
    }
  };

  return (
    <Style className={`Search ${className}`}>
      <Icon icon="search" size={16} color="var(--text-accent)" />
      <Input ref={ref} className="Search-input" placeholder={text} onKeyDown={handleKeyDown}></Input>
      <Tooltip text="단축키" pos="bottom">
        <Hotkey className="Search-hotkey">/</Hotkey>
      </Tooltip>
    </Style>
  );
}
