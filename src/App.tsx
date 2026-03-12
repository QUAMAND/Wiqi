import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"
import { Provider, useSetting } from "./hooks/Settings";
import { DocNode, SearchResult } from "./components/SearchResult";

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Home } from "./components/Home";

import "./styles.css";
import docs from "./data/pages.json"

/* 페이지 종류를 설정합니다. */
type PageType = "home" | "markdown" | "calc" | "editor" | "search";

export interface PageState {
  type: PageType;
  url?: string;
  file?: string;
  query?: string;
}

/* 마크다운 파일 찾기 */
export function MarkdownPage({ file }: { file: string }) {
  const {t} = useSetting();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/documents/${file}`)
      .then((res) => res.ok ? res.text() : Promise.reject())
      .then(setContent)
      .catch(() => setContent(`# ${t.not_found_doc}`));
  }, [file]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}

export default function App() {
  const [sidebar, openSidebar] = useState(false);
  const [page, setPage] = useState<PageState>({ type: "home" });

  const handleSearch = (query: string) => {
    setPage({type: "search", query})
  }

  return (
    <Provider>
      <Topbar sidebarOpen={sidebar} sidebar={() => openSidebar((p) => !p)} onSearch={handleSearch} goHome={() => setPage({type:"home"})}/>

      <div className="Main">
        <Sidebar open={sidebar} page={page} onSelect={setPage}/>

        <div className="App">
          {page.type === "home"     && <Home/>}
          {page.type === "markdown" && <MarkdownPage file={page.file!} />}
          {page.type === "calc"     && <p>계산기</p>}
          {page.type === "editor"   && <p>에디터</p>}
          {page.type === "search"   && (<SearchResult query={page.query!} docs={docs as DocNode[][]} onSelect={setPage}/>)}
        </div>
      </div>
    </Provider>
  );
}
