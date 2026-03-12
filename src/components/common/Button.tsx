import { ReactNode } from "react";
import "./index.css";

interface Props {
  text?: string;
  icon?: ReactNode;
  children?: ReactNode;
  color?: string;
  className?: string;
  action?: "source" | "copy";
  onClick?: () => void;
}

export function Button({
  text,
  icon,
  children,
  color = "var(--text-second)",
  className = "",
  action,
  onClick,
}: Props) {
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
    <button className={`Button ${className}`} color={color} onClick={click}>
      {children}
      {icon && <span className="Button-icon">{icon}</span>}
      {text && <span className="Button-text">{text}</span>}
    </button>
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
