import { useSetting } from "../hooks/Settings";
import basic from "../data/page/docs/basic.json";
import advanced from "../data/page/docs/advanced.json";
import homes from "../data/page/homes.json";

import { Footer } from "./common/Footer";
import { Item, OperPages } from "./sidebar/Item";
import { CountingChildren, Group } from "./sidebar/Group";
import { Line } from "./common/Line";
import { Tooltip } from "./common/Tooltip";
import { PageState } from "../types";

interface Props {
  open: boolean;
  page: PageState;
  onSelect: (state: PageState) => void;
}

export function Sidebar({ open, page, onSelect }: Props) {
  const { t } = useSetting();

  return (
    <div className={`Sidebar ${open}`}>
      <div className="Sidebar-inner">

        <div className="Sidebar-header">
          <span>{t.sidebar.list}</span>
        </div>

        <nav className="Sidebar-list">
          <Group text={t.sidebar.home} icon="home" color="var(--accent-red)" glow="var(--accent-glow-red)" count={CountingChildren(homes)} onClick={() => onSelect({ type: "home" })}>
            <Item icon="home" text="홈 페이지" onClick={() => onSelect({ type: "home" })} />
          </Group>

          <Group text={t.sidebar.docs} icon="docs" color="var(--accent-gold)" glow="var(--accent-glow-gold)" count={CountingChildren([...basic, ...advanced])}>
            <OperPages docs={basic} page={page} onSelect={onSelect} />
            <Line width={0} height={36} />
            <OperPages docs={advanced} page={page} onSelect={onSelect} />
          </Group>

          <Group text={t.sidebar.calc} icon="calc" color="var(--accent-green)" glow="var(--accent-glow-green)" />
          <Group text={t.sidebar.edit} icon="edit" color="var(--accent-blue)" glow="var(--accent-glow-blue)" />
        </nav>

        <Line width={292} height={1} />

        <Tooltip text={t.sidebar.version} pos="right" len={2}>
          <Footer text="Minecraft 1.21.11" color="green" />
        </Tooltip>
        <Tooltip text={t.sidebar.wiki_credits} pos="right" len={2}>
          <Footer text={t.credits} color="green" />
        </Tooltip>

        <br />

      </div>
    </div>
  );
}