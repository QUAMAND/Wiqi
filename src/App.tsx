import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Provider, useSetting } from "./hooks/Settings";
import { SearchResult } from "./components/page/search/SearchResult";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Topbar } from "./components/Topbar";
import { NavControl } from "./components/common/NavControl";
import { TocOverlay } from "./components/common/TocOverlay";
import { Home } from "./components/page/home/Home";
import { PageState } from "./types";

import "./styles.css";
import { Credits } from "./components/page/home/Credits";
import { Versions } from "./components/page/home/Versions";
import { useAppRouter } from "./hooks/useAppRouter";
import { MarkdownPage } from "./components/page/markdown/Markdown";

export type { PageState };

/** 메인 페이지 */
export default function App() {
  return (
    <Provider>
      <Content />
    </Provider>
  );
}

function Content() {
  const {page, pushPage, goRandom} = useAppRouter();
  const { setting } = useSetting();

  const [sidebar, openSidebar] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    setTocOpen(false);
  }, [location]);

  return (
    <>
      <Topbar
        sidebarOpen={sidebar}
        sidebar={() => openSidebar(p => !p)}
        onSearch={q => pushPage({ type: "search", query: q })}
        goHome={() => pushPage({ type: "home" })}
        onRandom={goRandom}
      />
      <div className="Main">
        <Sidebar open={sidebar} page={page} onSelect={pushPage} />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/credits" element={<Credits />} />
            <Route path="/versions" element={<Versions />} />

            {/* 검색 페이지 */}
            <Route path="/search" element={
              <SearchResult 
                query={page.type === "search" ? page.query || "" : ""} 
                onSelect={pushPage} 
              />
            } />
            
            {/* Markdown 페이지 (URL 구조에 따라 path 수정 필요) */}
            <Route path="/doc/*" element={
              <MarkdownPage 
                file={page.file!} 
                url={page.url!}
              />
            }/>

            {/** 나머지 값은 home으로 재설정 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      {setting.nav && <NavControl onToggleToc={() => setTocOpen((p) => !p)} />}
      {page.type === "markdown" && (
        <TocOverlay open={tocOpen} onClose={() => setTocOpen(false)} />
      )}
    </>
  );
}