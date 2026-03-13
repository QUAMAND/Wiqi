import styled from "styled-components";
import { ReactNode } from "react";

const Style = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid var(--l-dim);
  background: transparent;
  cursor: pointer;

  &:hover {
    background: var(--bg-raised);
  }
`
const Text = styled.span<{$color: string}>`
  font-family: "code";
  color: ${p => p.$color};
  border-radius: var(--radius-s);
  transition: all var(--transition);
  white-space: nowrap;
`

interface Props {
  text?: string;
  icon?: ReactNode;
  children?: ReactNode;
  color?: string;
  className?: string;
  action?: "source" | "copy";
  onClick?: () => void;
}

export function Button({text, icon, children, color = "var(--text-second)", className = "", action, onClick}: Props) {
  /* 클릭 시 기능 구현 for action */
  const click = () => {
    if (action === "source") {
      source();
    } else if (action === "copy") {
      copy();
    }
    onClick?.();
  };

  return (
    <Style className={`Button ${className}`} color={color} onClick={click}>
      {children}
      {icon && <Text $color={color} className="Button-icon">{icon}</Text>}
      {text && <Text $color={color} className="Button-text">{text}</Text>}
    </Style>
  );
}

/* 페이지 소스 보기 */
function source() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/plain;charset=utf-8" });
  window.location.href = URL.createObjectURL(blob);
}

/* 페이지 소스 복사하기 */
function copy() {
  const html = document.documentElement.outerHTML;
  navigator.clipboard.writeText(html);
}
