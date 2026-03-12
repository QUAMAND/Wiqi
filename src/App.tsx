import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Provider, useSetting } from "./hooks/Settings";
import "./styles.css";
import { Home } from "./components/Home";

type PageType = "home" | "markdown" | "calc" | "editor";

export interface SelectState {
  type: PageType;
  url?: string;
  file?: string;
}

/* 마크다운 파일 찾기 */
export function MarkdownPage({ file }: { file: string }) {
  const {t} = useSetting();
  const [content, setContent] = useState("");
  
  useEffect(() => {
    fetch(`/documents/${file}`)
      .then((res) => res.ok ? res.text() : Promise.reject())
      .then(setContent)
      .catch(() => setContent(`# ${t.not_found_doc}`));
  }, [file]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}

export default function App() {
  const [sidebar, openSidebar] = useState(false);
  const [page, setPage] = useState<SelectState>({ type: "home" });

  return (
    <Provider>
      <Topbar sidebarOpen={sidebar} sidebar={() => openSidebar((p) => !p)} />
      <div className="Main">
        <Sidebar open={sidebar} page={page} onSelect={setPage}/>
        <div className="App">
          {page.type === "home"     && <Home/>}
          {page.type === "markdown" && <MarkdownPage file={page.file!} />}
          {page.type === "calc"     && <p>계산기</p>}
          {page.type === "editor"   && <p>에디터</p>}
        </div>
      </div>
    </Provider>
  );
}
