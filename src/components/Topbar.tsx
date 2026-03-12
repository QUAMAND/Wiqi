import { LangItems, LangKeys } from "../data/lang";
import { useSetting } from "../hooks/Settings";
import { Button } from "./common/Button";
import { Dropdown } from "./common/Dropdown";
import { Hamburger } from "./common/Hamburger";
import { Icon } from "./common/Icon";
import { Line } from "./common/Line";
import { Search } from "./common/Search";
import { Title } from "./common/Title";
import { Tooltip } from "./common/Tooltip";
import "./main.css";

interface Props {
  sidebar: () => void;
  sidebarOpen: boolean;
  onSearch: (query: string) => void
  goHome: () => void;
}

export function Topbar({ sidebar, sidebarOpen, onSearch, goHome }: Props) {
  const { t, Update, setting } = useSetting();

  return (
    <header className="Topbar">
      {/* 왼쪽 */}
      <div className="Topbar-left">
        <Hamburger open={sidebarOpen} onClick={sidebar} />
        <Tooltip text={t.topbar.home} pos="bottom">
          <a onClick={goHome} style={{textDecoration:"none", marginTop: "4px"}}>
            <Title title="Wiqi" />
          </a>
        </Tooltip>

        <Line />

        <Tooltip text={t.topbar.view_source} pos="bottom">
          <Button
            text="View-source"
            icon={<Icon icon="source" size={20} />}
            action="source"
          />
        </Tooltip>

        <Tooltip text={t.topbar.random} pos="bottom">
          <Button icon={<Icon icon="shuffle" size={20} />} />
        </Tooltip>
      </div>

      {/* 오른쪽 */}
      <div className="Topbar-right">
        <Search text={t.topbar.search} onSearch={onSearch}/>

        <Tooltip text={t.topbar.lang} pos="left">
          <Dropdown
            items={LangItems}
            value={setting.lang}
            icon="lang"
            onSelect={(k) => Update("lang", k as LangKeys)}
          />
        </Tooltip>

        <Tooltip text={t.topbar.profile} pos="left">
          <Button icon={<Icon icon="profile" size={20} />} />
        </Tooltip>

        <a href="https://github.com/QUAMAND/Wiqi" style={{marginTop: "4px"}}>
          <Icon icon="github" size={20} color="var(--bg-raised)" />
        </a>
      </div>
    </header>
  );
}