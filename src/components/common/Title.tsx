import "./index.css";

interface Props {
  title: string;
  className?: string;
}

export function Title({ title, className = "" }: Props) {
  return <div className={`Title ${className}`}>{title}</div>;
}
