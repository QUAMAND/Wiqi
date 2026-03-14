import styled from "styled-components";
import { Icon } from "./Icon";
import { Tooltip } from "./Tooltip";
import { useSetting } from "../../hooks/Settings";

const Container = styled.div`
  position: fixed;
  right: 32px;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
  animation: fadeIn 300ms ease;
`;
const NavButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--bg-stone);
  border: 1px solid var(--l-sub);
  color: var(--text-second);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-m);
  transition: all var(--transition);

  &:hover {
    background: var(--bg-raised);
    color: var(--accent-blue);
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow:
      var(--shadow-m),
      0 0 0 2px color-mix(in srgb, var(--accent-blue) 25%, transparent);
  }

  &:active {
    transform: translateY(0);
  }
`;

export function NavControl({ onToggleToc }: { onToggleToc?: () => void }) {
  const { t } = useSetting();
  const handleToggle = () => {
    if (onToggleToc) onToggleToc();
  };

  const scrollTo = (pos: "top" | "bottom") => {
    const app = document.querySelector(".App") as HTMLElement;
    
    const isAppScrollable = app && app.scrollHeight > app.clientHeight;

    const target = isAppScrollable ? app : window;
    
    if (pos === "top") {
      target.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const scrollHeight = isAppScrollable ? app.scrollHeight : document.documentElement.scrollHeight;
      target.scrollTo({ top: scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <Container>
      <Tooltip text={t.topbar.toc} pos="left">
        <NavButton onClick={handleToggle} title={t.topbar.toc}>
          <Icon icon="toc" size={30} />
        </NavButton>
      </Tooltip>
      <Tooltip text={t.topbar.top} pos="left">
        <NavButton onClick={() => scrollTo("top")} title={t.topbar.top}>
          <Icon icon="jump" size={36} style={{ transform: "rotate(0deg)", marginTop: "-6px" }} />
        </NavButton>
      </Tooltip>
      <Tooltip text={t.topbar.bottom} pos="left">
        <NavButton onClick={() => scrollTo("bottom")} title={t.topbar.bottom}>
          <Icon icon="jump" size={36} style={{ transform: "rotate(180deg)", marginTop: "6px"  }} />
        </NavButton>
      </Tooltip>
    </Container>
  );
}
