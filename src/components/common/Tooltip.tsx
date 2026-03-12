import { CSSProperties, ReactNode, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./index.css";

interface Props {
  text?: string;
  children?: ReactNode;
  pos?: "top" | "bottom" | "left" | "right";
  len?: number;
  className?: string;
}

export function Tooltip({
  text = "",
  children,
  pos = "top",
  len = 6,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({top: 0, left: 0});

  const handleMousePointer = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (pos) {
        case "top":
          top = rect.top - len;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + len;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - len;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + len;
          break;
      }

      setCoords({top, left});
      setVisible(true);
    }
  }

  return (
    <div
      ref={ref}
      className={`Tooltip ${className}`}
      onMouseEnter={handleMousePointer}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && 
      createPortal(
        <span className={`Tooltip-box ${pos}`}
          style={{
            top: coords.top,
            left: coords.left
          } as CSSProperties}
        >
          {text}
        </span>, document.body
      )}
    </div>
  );
}
