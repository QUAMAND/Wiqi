import { Dot } from "./Dot";
import "./index.css";

interface Props {
  text: string;
  color?: string;
  className?: string;
}

export function Footer({ text, color = "green", className = "" }: Props) {
  return (
    <div className={`Footer ${className}`}>
      <span className="Footer-inner">
        <Dot dot={color} />
        <span>{text}</span>
      </span>
    </div>
  );
}
