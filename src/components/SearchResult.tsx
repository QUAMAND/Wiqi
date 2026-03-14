import { useMemo } from "react";
import { PageState, DocNode, FlatDoc } from "../types";
import { useSetting } from "../hooks/Settings";
import { useFetch } from "../hooks/useFetch";
import { fetchText } from "../utils/api";
import { Icon } from "./common/Icon";

import basic from "../data/page/docs/basic.json";
import advanced from "../data/page/docs/advanced.json";
import "./searchresult.css";
interface Props {
  query: string;
  onSelect: (state: PageState) => void;
}

export function SearchResult({ query, onSelect }: Props) {
  const { t } = useSetting();

  const allDocs = useMemo(() => flatten([...basic, ...advanced] as DocNode[]), []);
  const { fetchedDocs, loading } = useFetchedDocs(allDocs);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fetchedDocs;
    return fetchedDocs.filter((d) =>
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
          {loading ? t.loading : `${results.length}`}
        </span>
      </div>

      {loading ? (
        <div className="SearchPage-empty">
          <Icon icon="time" size={64} />
          <p>{t.loading_doc}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="SearchPage-empty">
          <Icon icon="search" size={64} />
          <p>{t.not_match_doc}</p>
          <p className="SearchPage-empty-sub">{t.search.other_keyword}</p>
        </div>
      ) : (
        <ul className="SearchPage-list">
          {results.map((doc) => {
            const excerpt = doc.content ? getExcerpt(doc.content, query) : null;
            return (
              <li key={`${doc.file}-${doc.title}`} className="SearchPage-item"
                onClick={() => onSelect({ type: "markdown", url: doc.url, file: doc.file })}>
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

function flatten(nodes: DocNode[]): FlatDoc[] {
  return nodes.flatMap((node) => [
    { url: node.url, title: node.title, subtitle: node.subtitle ?? "", file: node.file },
    ...(node.children ? flatten(node.children) : []),
  ]);
}

function getExcerpt(content: string, query: string): string | null {
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return null;
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 40);
  return (start > 0 ? "···" : "") + content.slice(start, end) + (end < content.length ? "···" : "");
}

/** 문서 가지고 오기 */
function useFetchedDocs(docs: FlatDoc[]) {
  const { data, loading } = useFetch(
    () =>
      Promise.all(
        docs.map((doc) =>
          fetchText(`${process.env.PUBLIC_URL}/documents/${doc.file}`)
            .catch(() => "")
            .then((content) => ({ ...doc, content }))
        )
      ),
    [docs]
  );

  return { fetchedDocs: data ?? [], loading };
}

/** 검색어 하이라이팅 */
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
