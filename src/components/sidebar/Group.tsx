import "./sub.css";

import { CSSProperties, ReactNode, useState } from "react";
import { Badge } from "../common/Badge";
import { Icon, IconKeys } from "../common/Icon";

interface Props {
  text: string;
  icon?: IconKeys;
  count?: number;
  color?: string;
  glow?: string;
  depth?: number;
  fontSize?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Group({
  text,
  icon,
  count,
  color,
  glow,
  depth = 0,
  fontSize = "1rem",
  children,
  onClick,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{marginLeft: depth * 9}}>
      <button
        className={`Group ${open} ${className}`}
        onClick={() => setOpen((v) => !v)}
        style={{ "--open": color, "--open-glow": glow} as CSSProperties}
      >
        {icon && <Icon size={20} color={color} icon={icon} />}

        <span className="Group-text" style={{ fontSize }}>{text}</span>

        {count !== undefined && <Badge badge={count} className="Group-count" />}

        <Icon icon="dropdown" size={20} className={`Group-dropdown ${open}`} />
      </button>
      <div className={`Group-items ${open}`}>
        {children}
      </div>
    </div>
  );
}