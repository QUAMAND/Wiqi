import { useEffect, useRef } from "react";
import { Icon } from "./Icon";
import "./index.css";
import { Tooltip } from "./Tooltip";

interface Props {
  text?: string;
  className?: string;
}

export function Search({ text, className = "" }: Props) {
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

  return (
    <div className={`Search ${className}`}>
      <Icon icon="search" size={16} color="var(--text-accent)" />
      <input ref={ref} className="Search-input" placeholder={text}></input>
      <Tooltip text="단축키" pos="bottom">
        <span className="Search-hotkey">/</span>
      </Tooltip>
    </div>
  );
}
