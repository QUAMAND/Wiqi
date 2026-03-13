import { PageState } from "../types";
import basic from "../data/page/docs/basic.json";
import advanced from "../data/page/docs/advanced.json";

const allDocs = [...basic, ...advanced];

function flattenDocs(pages: any[]): any[] {
  return pages.flatMap((page) => [
    page,
    ...(page.children ? flattenDocs(page.children) : []),
  ]);
}

export function getRandomDocUrl(): string | undefined {
  const flatDocs = flattenDocs(allDocs);
  if (flatDocs.length === 0) return undefined;
  const randomDoc = flatDocs[Math.floor(Math.random() * flatDocs.length)];
  return randomDoc.url;
}

export interface NavDoc {
  url: string;
  title: string;
}

export function getNextPrevDocs(currentUrl: string): { next?: NavDoc; prev?: NavDoc } {
  const flatDocs = flattenDocs(allDocs);
  const currentIndex = flatDocs.findIndex((doc) => doc.url === currentUrl);

  return {
    prev: currentIndex > 0 ? { url: flatDocs[currentIndex - 1].url, title: flatDocs[currentIndex - 1].title } : undefined,
    next: currentIndex < flatDocs.length - 1 ? { url: flatDocs[currentIndex + 1].url, title: flatDocs[currentIndex + 1].title } : undefined,
  };
}

export function getNextPrevDocsByFile(currentFile: string): { next?: NavDoc; prev?: NavDoc } {
  const flatDocs = flattenDocs(allDocs);

  // 현재 파일과 다른 이전 문서 찾기
  let prevDoc: NavDoc | undefined;
  for (let i = flatDocs.length - 1; i >= 0; i--) {
    if (flatDocs[i].file !== currentFile) {
      prevDoc = { url: flatDocs[i].url, title: flatDocs[i].title };
      break;
    }
  }

  // 현재 파일과 다른 다음 문서 찾기
  let nextDoc: NavDoc | undefined;
  for (let i = 0; i < flatDocs.length; i++) {
    if (flatDocs[i].file !== currentFile) {
      nextDoc = { url: flatDocs[i].url, title: flatDocs[i].title };
      break;
    }
  }

  return {
    prev: prevDoc,
    next: nextDoc,
  };
}

export function getNextPrevDocsSkipSameFile(currentUrl: string): { next?: NavDoc; prev?: NavDoc } {
  const flatDocs = flattenDocs(allDocs);
  const currentIndex = flatDocs.findIndex((doc) => doc.url === currentUrl);

  if (currentIndex === -1) return {};

  const currentFile = flatDocs[currentIndex].file;

  // 이전 찾기 (같은 파일 제외)
  let prevDoc: NavDoc | undefined;
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (flatDocs[i].file !== currentFile) {
      prevDoc = { url: flatDocs[i].url, title: flatDocs[i].title };
      break;
    }
  }

  // 다음 찾기 (같은 파일 제외)
  let nextDoc: NavDoc | undefined;
  for (let i = currentIndex + 1; i < flatDocs.length; i++) {
    if (flatDocs[i].file !== currentFile) {
      nextDoc = { url: flatDocs[i].url, title: flatDocs[i].title };
      break;
    }
  }

  return { prev: prevDoc, next: nextDoc };
}

export function urlToFile(url: string): string | undefined {
  function walk(pages: any[]): string | undefined {
    for (const page of pages) {
      if (page.url === url) return page.file;
      if (page.children) {
        const found = walk(page.children);
        if (found) return found;
      }
    }
  }
  return walk(allDocs);
}

export function pathToPage(pathname: string, search: string): PageState {
  if (pathname.startsWith("/doc")) return { type: "markdown", url: pathname.replace("/doc", ""), file: urlToFile(pathname.replace("/doc", "")) };
  if (pathname === "/calc")        return { type: "calc" };
  if (pathname === "/editor")      return { type: "editor" };
  if (pathname === "/search")      return { type: "search", query: new URLSearchParams(search).get("q") ?? "" };
  return { type: "home" };
}

export function pageToPath(state: PageState): string {
  switch (state.type) {
    case "markdown": return `/doc${state.url}`;
    case "search":   return `/search?q=${state.query}`;
    case "calc":     return "/calc";
    case "editor":   return "/editor";
    default:         return "/";
  }
}
