import { useEffect } from "react";
import "./markdown.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Icon } from "../../common/Icon";
import { useSetting } from "../../../hooks/Settings";
import { useAppRouter, getNextPrevDocsSkipSameFile } from "../../../hooks/useAppRouter";
import { useFetch } from "../../../hooks/useFetch";
import { fetchText } from "../../../utils/api";

const BASE_URL = () => window.location.hash.split("#").slice(0, 2).join("#");

/** /#/doc/some-page#heading-id 형태로 생성 */
const makeHeading = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") =>
  ({ id, children }: { id?: string; children?: React.ReactNode }) => (
    <Tag id={id}>
      <a
        href={`${BASE_URL()}#${id}`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(id!)?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {children}
      </a>
    </Tag>
  );

const HEADING_COMPONENTS = {
  h1: makeHeading("h1"),
  h2: makeHeading("h2"),
  h3: makeHeading("h3"),
  h4: makeHeading("h4"),
  h5: makeHeading("h5"),
  h6: makeHeading("h6"),
} as const;


export function MarkdownPage({ file, url }: { file: string; url: string }) {
  const { pushPage, location } = useAppRouter();
  const { t } = useSetting();

  const { data: content = "", error } = useFetch(
    () => fetchText(`${process.env.PUBLIC_URL}/documents/${file}`),
    [file]
  );

  const finalContent = error ? `# ${t.not_found_doc}` : content;
  const { next, prev } = getNextPrevDocsSkipSameFile(url);

  /** 링크 이동 */
  useEffect(() => {
    if (!finalContent) return;

    const hash = decodeURIComponent(location.hash.split("#").slice(-1)[0] ?? "");
    if (!hash) return;

    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    });
  }, [finalContent]);

  /** 이동 -> 스크롤 */
  useEffect(() => {
    if (location.hash) return;
    document.querySelector(".App")?.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  return (
    <>
      <div className="markdown">
        <ReactMarkdown
          rehypePlugins={[rehypeSlug, rehypeRaw]}
          components={HEADING_COMPONENTS}
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
            <Icon icon="arrow" style={{ transform: "rotate(180deg)" }} />
            {prev.title}
          </button>
        )}
        {next && (
          <button
            onClick={() => pushPage({ type: "markdown", url: next.url })}
            className="markdown-nav-btn markdown-nav-next"
          >
            {next.title}
            <Icon icon="arrow" />
          </button>
        )}
      </div>
    </>
  );
}