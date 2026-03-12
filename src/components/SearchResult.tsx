import { useMemo, useEffect, useState } from "react";
import { PageState } from "../App";

import "./searchresult.css";
import { Icon } from "./common/Icon";
import { useSetting } from "../hooks/Settings";

export interface DocNode {
  url: string;
  title: string;
  subtitle?: string;
  file: string;
  children?: DocNode[];
}

interface FlatDoc {
  url: string;
  title: string;
  subtitle: string;
  file: string;
  content?: string;
}

/* 문서를 펼칩니다(flatting) */
function flatten(nodes: DocNode[]): FlatDoc[] {
  return nodes.flatMap((node) => [
    { url: node.url, title: node.title, subtitle: node.subtitle ?? "", file: node.file },
    ...(node.children ? flatten(node.children) : []),
  ]);
}

/* 검색어 하이라이팅 */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="SearchPage-mark">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

/* 문서 가지고 오기 */
function useFetchedDocs(docs: FlatDoc[]) {
  const [fetchedDocs, setFetchedDocs] = useState<FlatDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (docs.length === 0) return;

    setLoading(true);
    Promise.all(
      docs.map((doc) =>
        fetch(`${process.env.PUBLIC_URL}/documents/${doc.file}`)
          .then((res) => res.ok ? res.text() : "")
          .catch(() => "")
          .then((content) => ({ ...doc, content }))
      )
    ).then((result) => {
      setFetchedDocs(result);
      setLoading(false);
    });
  }, [docs]);

  return { fetchedDocs, loading };
}

/* 내용 미리보기 */
function getExcerpt(content: string, query: string): string | null {
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return null;
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 40);
  return (start > 0 ? "···" : "") + content.slice(start, end) + (end < content.length ? "···" : "");
}

/* main */
interface Props {
  query: string;
  docs: DocNode[][];
  onSelect: (state: PageState) => void;
}

export function SearchResult({ query, docs, onSelect }: Props) {
  const {t} = useSetting();

  const allDocs = useMemo(() => flatten(docs.flat()), [docs]);
  const { fetchedDocs, loading } = useFetchedDocs(allDocs);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fetchedDocs;
    return fetchedDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.content?.toLowerCase().includes(q)
    );
  }, [query, fetchedDocs]);

  return (
    <div className="SearchPage">
      <div className="SearchPage-header">
        <h2 className="SearchPage-title">
          {t.search.result}
          <span className="SearchPage-query">"{query}"</span>
        </h2>
        <span className="SearchPage-count">
          {loading ? `${t.loading}` : `${results.length}`}
        </span>
      </div>

      {loading ? (
        <div className="SearchPage-empty">
          <span className="SearchPage-empty-icon"><Icon icon="time" size={64}/></span>
          <p>{t.loading_doc}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="SearchPage-empty">
          <span className="SearchPage-empty-icon"><Icon icon="search" size={64}/></span>
          <p>{t.not_match_doc}</p>
          <p className="SearchPage-empty-sub">{t.search.other_keyword}</p>
        </div>
      ) : (
        <ul className="SearchPage-list">
          {results.map((doc, i) => {
            const excerpt = doc.content ? getExcerpt(doc.content, query) : null;
            return (
              <li
                key={`${doc.file}-${doc.title}`}
                className="SearchPage-item"
                onClick={() => onSelect({ type: "markdown", file: doc.file })}
              >
                <div className="SearchPage-item-title">
                  <Highlight text={doc.title} query={query} />
                </div>
                {doc.subtitle && (
                  <div className="SearchPage-item-subtitle">
                    <Highlight text={doc.subtitle} query={query} />
                  </div>
                )}
                {excerpt && (
                  <div className="SearchPage-item-excerpt">
                    <Highlight text={excerpt} query={query} />
                  </div>
                )}
                <div className="SearchPage-item-path">{doc.file}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}