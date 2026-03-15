import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Icon } from "../../common/Icon";
import { useSetting } from "../../../hooks/Settings";
import { useAppRouter, getNextPrevDocsSkipSameFile } from "../../../hooks/useAppRouter";
import { useFetch } from "../../../hooks/useFetch";
import { fetchText } from "../../../utils/api";


export function MarkdownPage({ file, url }: { file: string; url: string; }) {
  const { pushPage, location } = useAppRouter();
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
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [finalContent]);

  /** prev, next 버튼은 무조건 페이지의 맨 위로 이동합니다 */
  useEffect(() => {
    if (location.hash) return;
    document.querySelector(".App")?.scrollTo({ top: 0 });
  }, [location.pathname]);

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
            onClick={() => pushPage({ type: "markdown", url: prev.url })}
            className="markdown-nav-btn markdown-nav-prev"
          >
            <Icon icon="arrow" style={{ transform: "rotate(180deg)" }} /> {prev.title}
          </button>
        )}
        {next && (
          <button
            onClick={() => pushPage({ type: "markdown", url: next.url })}
            className="markdown-nav-btn markdown-nav-next"
          >
            {next.title} <Icon icon="arrow" />
          </button>
        )}
      </div>
    </>
  );
}
