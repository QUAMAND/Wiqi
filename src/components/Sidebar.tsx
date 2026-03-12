import { Footer } from "./common/Footer";
import docs from "../data/pages.json"
import { Group } from "./sidebar/Group";
import { Pages } from "./sidebar/Pages";
import { Line } from "./common/Line";
import { Tooltip } from "./common/Tooltip";
import { SelectState } from "../App";
import { useSetting } from "../hooks/Settings";

interface Props {
  open: boolean;
  page: SelectState
  onSelect: (state: SelectState) => void;
}

export function Sidebar({ open, page, onSelect }: Props) {
  const {t} = useSetting();

  return (
    <>
      {/* 실제 사이드 바*/}
      <div className={`Sidebar ${open}`}>
        <div className="Sidebar-inner">
          <div className="Sidebar-header">
            <span>{t.sidebar.list}</span>
          </div>

          <nav className="Sidebar-list">
            <Group text={t.sidebar.home} icon="home" color="var(--accent-red)" glow="var(--accent-glow-red)"
            onClick={() => onSelect({type: "home"})}></Group>

            <Group text={t.sidebar.docs} icon="docs" color="var(--accent-gold)" glow="var(--accent-glow-gold)">
              <Pages docs={docs} page={page} onSelect={onSelect} />
            </Group>

            <Group text={t.sidebar.calc} icon="calc" color="var(--accent-green)" glow="var(--accent-glow-green)"></Group>
          </nav>
        <Line width={292} height={1}/>

        <Tooltip text={t.sidebar.version} pos="right" len={2}>
          <Footer text="Minecraft 1.21.11" color="green"/>
        </Tooltip>

        <Tooltip text={t.sidebar.wiki_credits} pos="right" len={2}>
          <Footer text={t.credits} color="green"/>
        </Tooltip>
        </div>
      </div>
    </>
  );
}
