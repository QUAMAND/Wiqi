import { DocNode, PageState, PageType } from "../types";
import basic from "../data/page/docs/basic.json";
import advanced from "../data/page/docs/advanced.json";

function flattenDocs(pages: DocNode[]): DocNode[] {
  return pages.flatMap((page) => [
    page,
    ...(page.children ? flattenDocs(page.children) : []),
  ]);
}

const allDocs: DocNode[] = [...basic, ...advanced];
const flatDocs = flattenDocs(allDocs)
const urlMap = new Map<string, DocNode>(flatDocs.map(doc => [doc.url, doc]))

/** 무작위 url을 반환합니다 */
export function getRandomDocUrl(): string | undefined {
  return flatDocs.length === 0 ? undefined : flatDocs[Math.floor(Math.random() * flatDocs.length)].url
}

export interface NavDoc {
  url: string;
  title: string;
}

export function getNextPrevDocs(currentUrl: string): { next?: NavDoc; prev?: NavDoc } {
  const currentIndex = flatDocs.findIndex((doc) => doc.url === currentUrl);

  return {
    prev: currentIndex > 0 ? { url: flatDocs[currentIndex - 1].url, title: flatDocs[currentIndex - 1].title } : undefined,
    next: currentIndex < flatDocs.length - 1 ? { url: flatDocs[currentIndex + 1].url, title: flatDocs[currentIndex + 1].title } : undefined,
  };
}

export function getNextPrevDocsByFile(currentFile: string): { next?: NavDoc; prev?: NavDoc } {
  const prevDoc = [...flatDocs].reverse().find(d => d.file !== currentFile);
  const nextDoc = flatDocs.find(d => d.file !== currentFile);

  return {
    prev: prevDoc ? { url: prevDoc.url, title: prevDoc.title } : undefined,
    next: nextDoc ? { url: nextDoc.url, title: nextDoc.title } : undefined,
  };
}

export function getNextPrevDocsSkipSameFile(currentUrl: string): { next?: NavDoc; prev?: NavDoc } {
  const currentIndex = flatDocs.findIndex((doc) => doc.url === currentUrl);
  if (currentIndex === -1) return {};

  const currentFile = flatDocs[currentIndex].file;
  const prev = [...flatDocs.slice(0, currentIndex)].reverse().find(d => d.file !== currentFile);
  const next = flatDocs.slice(currentIndex + 1).find(d => d.file !== currentFile);

  return {
    prev: prev ? { url: prev.url, title: prev.title } : undefined,
    next: next ? { url: next.url, title: next.title } : undefined
  };
}

/** url을 이용해 실제 파일로 이동합니다 */
export function urlToFile(url: string): string | undefined {
  return urlMap.get(url)?.file;
}

export function pathToPage(pathname: string, search: string): PageState {
  const staticRoutes: Record<string, PageType> = {
    "/calc": "calc",
    "/editor": "editor",
    "/search": "search",
    "/credits": "credits",
    "/versions": "versions"
  };

  if (staticRoutes[pathname]) {
    const type = staticRoutes[pathname];
    return type === "search" 
      ? { type, query: new URLSearchParams(search).get("q") ?? "" }
      : { type };
  }

  if (pathname.startsWith("/doc")) {
    const url = pathname.replace("/doc", "");
    return { type: "markdown", url, file: urlToFile(url) };
  }

  return { type: "home" };
}

export function pageToPath(state: PageState): string {
  const mapping: Partial<Record<PageType, string>> = {
    markdown: `/doc${state.url}`,
    search: `/search?q=${state.query || ""}`,
    calc: "/calc",
    editor: "/editor",
    credits: "/credits",
    versions: "/versions",
    home: "/"
  };
  return mapping[state.type] ?? "/";
}
