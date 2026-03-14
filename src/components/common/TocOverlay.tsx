import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useSetting } from "../../hooks/Settings";

const Overlay = styled.div<{
  open: boolean;
}>`
  position: fixed;
  right: 32px;
  bottom: 180px;
  width: 280px;
  max-height: 60vh;
  padding: 10px;
  border-radius: 12px;
  background: var(--bg-backdrop);
  backdrop-filter: blur(8px);
  border: 1px solid var(--text-accent);
  box-shadow: var(--shadow-m);
  z-index: 210;
  display: ${(p) => (p.open ? "block" : "none")};
  overflow: hidden;
  animation: fadeIn 200ms ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-family: "title";
  font-weight: 700;
  color: var(--text-content);
`;

const Close = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--l-sub);
  background: var(--bg-void);
  color: var(--accent-red);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--bg-hover);
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  max-height: calc(60vh - 48px);
`;

const Item = styled.li<{ level: number }>`
  padding: 6px 8px;
  padding-left: ${(p) => (p.level - 1) * 12 + 8}px;
  cursor: pointer;
  border-radius: 10px;
  color: var(--text-second);
  font-size: 0.9rem;
  transition: background var(--transition), color var(--transition);

   &:hover {
      background: var(--accent-blue-dim);
      color: var(--text-accent);
  }
`;

type Heading = {
  id: string;
  text: string;
  level: number;
  numbering: string;
};

export function TocOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useSetting();
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    if (!open) return;

    const container = document.querySelector(".markdown");
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6")) as HTMLElement[];

    /** 제목의 크기, 좌측부터 #, ##, ### ... */
    const counters = [0, 0, 0, 0, 0, 0, 0];

    const list: Heading[] = nodes
      .map((node) => {
        if (!node.id) return null;
        const level = Number(node.tagName.replace("H", ""));
        if (Number.isNaN(level) || level < 1 || level > 6) return null;

        /** 증가 및 하위 자식 초기화 */
        counters[level] += 1;
        for (let i = level + 1; i <= 6; i += 1) counters[i] = 0;

        const numbering = counters.slice(1, level + 1).join("-");

        return {
          id: node.id,
          text: node.innerText,
          level,
          numbering,
        };
      })
      .filter(Boolean) as Heading[];

    setHeadings(list);
  }, [open]);

  const hasHeadings = useMemo(() => headings.length > 0, [headings]);

  const handleSelect = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  };

  return (
    <Overlay open={open}>
      <Header>
        <Title>{t.topbar.toc}</Title>
        <Close onClick={onClose} aria-label={t.topbar.toc}>
          X
        </Close>
      </Header>
      {hasHeadings ? (
        <List>
          {headings.map((h) => (
            <Item key={h.id} level={h.level} onClick={() => handleSelect(h.id)}>
              {h.numbering} {h.text}
            </Item>
          ))}
        </List>
      ) : (
        <div style={{ color: "var(--text-second)", fontSize: "0.9rem" }}>
          {t.topbar.toc_empty}
        </div>
      )}
    </Overlay>
  );
}
