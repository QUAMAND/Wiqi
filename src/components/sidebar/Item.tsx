import { Badge, BadgeType } from "../common/Badge";
import { Icon, IconKeys } from "../common/Icon";
import "./sub.css";

interface Props {
  text: string;
  icon?: IconKeys;
  badge?: BadgeType;
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
    <button
      className={`Group-item ${select ? "select" : ""} ${className}`}
      style={{ marginLeft: depth * 12 }}
      onClick={onClick}
    >
      {icon && <Icon size={13} icon={icon} />}

      <span className="Group-item-text" style={{ fontSize, color: textColor }}>{text}</span>

      {badge !== undefined && <Badge badge={badge} className="Group-item-badge" />}
    </button>
  );
}