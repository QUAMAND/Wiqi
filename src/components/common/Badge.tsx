import "./index.css";

export type BadgeType = "new" | "version" | "warn" | "tip" | number;

interface Props {
  badge: BadgeType;
  className?: string;
}

export function Badge({ badge, className = "" }: Props) {
  /* 숫자 => .number 클래스를 사용합니다 */
  const numeric = `Badge ${typeof badge === "number" ? "number" : badge}`;

  return <span className={numeric}>{badge}</span>;
}
