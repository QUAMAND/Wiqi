import { useState } from "react";
import "./index.css";

interface Props {
  open?: boolean;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function Hamburger({
  open,
  color = "var(--text-second)",
  className = "",
  onClick,
}: Props) {
  return (
    <button className={`Hamburger ${className} ${open}`} onClick={onClick}>
      <span style={{ background: color }} />
      <span style={{ background: color }} />
      <span style={{ background: color }} />
    </button>
  );
}
