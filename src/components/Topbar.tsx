import { useState } from "react";
import styled from "styled-components";
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
import { Dot } from "./common/Dot";
import "./main.css";

const ProfileMenuContainer = styled.div`
  position: relative;
`;
const ProfileMenuList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: var(--bg-stone);
  border: 1px solid var(--l-sub);
  border-radius: var(--radius-m);
  padding: 8px 0;
  z-index: 1000;
`;
const MenuSection = styled.div`
  padding: 8px 16px 4px;
  font-size: 11px;
  font-weight: bold;
  color: var(--text-second);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const MenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: ${p => p.$active ? "var(--accent-green)" : "var(--text-content)"};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition);

  &:hover {
    background: var(--bg-hover);
  }
`;
const Divider = styled.div`
  height: 1px;
  background: var(--l-dim);
  margin: 8px 0;
`;

interface Props {
  sidebar: () => void;
  sidebarOpen: boolean;
  onSearch: (query: string) => void;
  goHome: () => void;
  onRandom: () => void;
}

export function Topbar({ sidebar, sidebarOpen, onSearch, goHome, onRandom }: Props) {
  const { t, Update, setting } = useSetting();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="Topbar">
      <div className="Topbar-left">
        <Hamburger open={sidebarOpen} onClick={sidebar} />
        <Tooltip text={t.topbar.home} pos="bottom">
          <a onClick={goHome} style={{ textDecoration: "none", marginTop: "4px" }}>
            <Title title="Wiqi" />
          </a>
        </Tooltip>
        <Line />
        <Tooltip text={t.topbar.view_source} pos="bottom">
          <Button text="View-source" icon={<Icon icon="source" size={20} />} action="source" />
        </Tooltip>
        <Tooltip text={t.topbar.random} pos="bottom">
          <Button icon={<Icon icon="shuffle" size={20} />} onClick={onRandom} />
        </Tooltip>
      </div>

      <div className="Topbar-right">
        <Search text={t.topbar.search} onSearch={onSearch} />

        <Tooltip text={t.topbar.lang} pos="left">
          <Dropdown
            items={LangItems}
            value={setting.lang}
            icon="lang"
            onSelect={(k) => Update("lang", k as LangKeys)}
          />
        </Tooltip>
        
        <ProfileMenuContainer>
          <Tooltip text={t.topbar.profile} pos="left">
            <Button 
              icon={<Icon icon="profile" size={20} />} 
              onClick={() => setProfileOpen(!profileOpen)}
            />
          </Tooltip>
          
          {profileOpen && (
            <>
              <div 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
                onClick={() => setProfileOpen(false)} 
              />
              <ProfileMenuList>
                <MenuSection>{t.topbar.theme}</MenuSection>
                <MenuItem 
                  $active={setting.theme === "light"}
                  onClick={() => { Update("theme", "light"); setProfileOpen(false); }}
                >
                  <Icon icon="sun" size={18} color={setting.theme === "light" ? "var(--accent-green)" : undefined} />
                  {t.topbar.light}
                </MenuItem>
                <MenuItem 
                  $active={setting.theme === "dark"}
                  onClick={() => { Update("theme", "dark"); setProfileOpen(false); }}
                >
                  <Icon icon="moon" size={18} color={setting.theme === "dark" ? "var(--accent-green)" : undefined} />
                  {t.topbar.dark}
                </MenuItem>

                <Divider />
                
                <MenuSection>{t.topbar.lang}</MenuSection>
                {LangItems.map((item) => (
                  <MenuItem 
                    key={item.key}
                    $active={setting.lang === item.key}
                    onClick={() => { Update("lang", item.key as LangKeys); setProfileOpen(false); }}
                  >
                    <Dot dot={setting.lang === item.key ? "green" : "gray"} />
                    {item.value}
                  </MenuItem>
                ))}

                <Divider />
                <MenuItem 
                  onClick={() => { Update("nav", !setting.nav); }}
                >
                  <Dot dot={setting.nav ? "green" : "gray"} />
                  {t.topbar.nav}
                </MenuItem>
                <MenuItem 
                  onClick={() => { Update("fixed", !setting.fixed); }}
                >
                  <Dot dot={setting.fixed ? "green" : "gray"} />
                  {t.topbar.fixed}
                </MenuItem>
              </ProfileMenuList>
            </>
          )}
        </ProfileMenuContainer>

        <a href="https://github.com/QUAMAND/Wiqi">
          <Icon icon="github" size={20} color="var(--bg-raised)" />
        </a>
      </div>
    </header>
  );
}