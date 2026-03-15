import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, ComponentType } from "react";
import styled, { createGlobalStyle } from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
// @ts-ignore
import rehypeRaw from "rehype-raw";

import { Provider, useSetting } from "./hooks/Settings";
import { useFetch } from "./hooks/useFetch";
import { SearchResult } from "./components/page/search/SearchResult";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Topbar } from "./components/Topbar";
import { NavControl } from "./components/common/NavControl";
import { TocOverlay } from "./components/common/TocOverlay";
import { Home } from "./components/page/home/Home";
import { pathToPage, pageToPath, urlToFile, getRandomDocUrl, getNextPrevDocsSkipSameFile } from "./utils/routing";
import { fetchText } from "./utils/api";
import { PageState, PageType } from "./types";

import "./styles.css";
import "./markdown.css";
import { Icon } from "./components/common/Icon";
import { Credits } from "./components/page/home/Credits";
import { Versions } from "./components/page/home/Versions";

const GlobalLayoutStyle = createGlobalStyle<{ $fixed?: boolean }>`
  ${p => p.$fixed ? `
    .Sidebar {
      height: 100% !important;
      overflow-y: auto !important;
    }
  ` : `
    .Sidebar {
      position: sticky !important;
      top: 0;
    }
  `}
`;

export type { PageState };

function Content() {
  const navi = useNavigate();
  const location = useLocation();
  const { setting } = useSetting();
  const [sidebar, openSidebar] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  /** location을 기준으로 상태 계산 */
  const page = pathToPage(location.pathname, location.search);

  useEffect(() => {
    setTocOpen(false);
  }, [location]);

  const handleSelect = (state: PageState) => {
    const filled: PageState = state.type === "markdown" && !state.file
      ? { ...state, file: urlToFile(state.url!) }
      : state;

    const newPath = pageToPath(filled);
    if (newPath === location.pathname + location.search) return;
    navi(newPath);
  };

  const handleRandom = () => {
    const randomUrl = getRandomDocUrl();
    if (randomUrl) {
      handleSelect({ type: "markdown", url: randomUrl });
    }
  };

  return (
    <>
      <GlobalLayoutStyle $fixed={setting.fixed} />
      <Topbar
        sidebarOpen={sidebar}
        sidebar={() => openSidebar(p => !p)}
        onSearch={q => handleSelect({ type: "search", query: q })}
        goHome={() => handleSelect({ type: "home" })}
        onRandom={() => handleRandom()}
      />
      <div className="Main">
        <Sidebar open={sidebar} page={page} onSelect={handleSelect} />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/credits" element={<Credits />} />
            <Route path="/versions" element={<Versions />} />
            <Route path="/search" element={<SearchResult query={new URLSearchParams(location.search).get("q") || ""} onSelect={handleSelect} />} />
            
            {/* Markdown 페이지 (URL 구조에 따라 path 수정 필요) */}
            <Route 
              path="/doc/*" 
              element={<MarkdownPage file={page.file!} url={page.url!} onSelect={handleSelect} />} 
            />

            {/* 기본 경로 외에는 홈으로 리다이렉트하거나 404 처리 */}
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

export default function App() {
  return (
    <Provider>
      <Content />
    </Provider>
  );
}

export function MarkdownPage({ file, url, onSelect }: { file: string; url: string; onSelect: (state: PageState) => void }) {
  const { t } = useSetting();
  const { data: content = "", error } = useFetch(
    () => fetchText(`${process.env.PUBLIC_URL}/documents/${file}`),
    [file]
  );

  const finalContent = error ? `# ${t.not_found_doc}` : content;
  const { next, prev } = getNextPrevDocsSkipSameFile(url);

  useEffect(() => {
    if (!finalContent) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [finalContent]);

  return (
    <>
      <div className="markdown">
        <ReactMarkdown
          rehypePlugins={[rehypeSlug, [rehypeAutolink, { behavior: "wrap" }], rehypeRaw]}
        >
          {finalContent}
        </ReactMarkdown>
      </div>

      <div className="markdown-nav">
        {prev && (
          <button
            onClick={() => onSelect({ type: "markdown", url: prev.url })}
            className="markdown-nav-btn markdown-nav-prev"
          >
            <Icon icon="arrow" style={{transform:"rotate(180deg)"}}/> {prev.title}
          </button>
        )}
        {next && (
          <button
            onClick={() => onSelect({ type: "markdown", url: next.url })}
            className="markdown-nav-btn markdown-nav-next"
          >
            {next.title} <Icon icon="arrow"/>
          </button>
        )}
      </div>
    </>
  );
}