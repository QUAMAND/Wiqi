/**
 * 페이지 상태 유형
 */
export type PageType = "home" | "versions" | "credits" | "markdown" | "calc" | "editor" | "etc" | "search";

export interface PageState {
  type: PageType;
  url?: string;
  file?: string;
  query?: string;
}

/**
 * 문서 관련 유형
 */
export interface DocNode {
  url: string;
  title: string;
  subtitle?: string;
  file: string;
  children?: DocNode[];
}

export interface FlatDoc {
  url: string;
  title: string;
  subtitle: string;
  file: string;
  content?: string;
}

/**
 * 뉴스 아이템 유형
 */
export interface NewsItem {
  title: string;
  version: string;
  type: string;
  date: string;
  shortText: string;
  image: { url: string; title: string };
  contentPath: string;
}
