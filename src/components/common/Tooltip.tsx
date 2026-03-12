import { CSSProperties, ReactNode, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const transform: Record<string, string> = {
  top:    "translateX(-50%) translateY(-100%)",
  bottom: "translateX(-50%)",
  left:   "translateX(-100%) translateY(-50%)",
  right:  "translateY(-50%)",
}

const Style = styled.div`
  position: relative;
  display: inline-flex;
  width: fit-content;
`

const Box = styled.span<{$pos: string}>`
  position: fixed;
  padding: 8px 10px;
  white-space: nowrap;
  background-color: var(--bg-backdrop);
  backdrop-filter: blur(4px);
  border: 1px solid var(--bg-hover);
  color: var(--text-content);
  border-radius: 4px;
  pointer-events: none;
  z-index: 9999;
  transform: ${p => transform[p.$pos]}
`

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
    <Style
      ref={ref}
      className={`Tooltip ${className}`}
      onMouseEnter={handleMousePointer}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && 
      createPortal(
        <Box $pos={pos} style={{top: coords.top, left: coords.left}} className={`Tooltip-box ${pos}`}        >
          {text}
        </Box>, document.body
      )}
    </Style>
  );
}
