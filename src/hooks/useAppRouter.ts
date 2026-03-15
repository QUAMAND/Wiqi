import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { PageState } from "../types";
import { URL_MAP, FLAT_DOCS, ROUTE_MAP, PAGE_TO_PATH } from "./RoutingConst";

export function useAppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  /** 현재 url을 기준으로 페이지 계산 */
  const page = useMemo(() => 
    pathToPage(location.pathname, location.search), 
  [location.pathname, location.search]);

  /** 실제 페이지 이동 */
  const pushPage = useCallback((state: PageState) => {
    const filled: PageState = (state.type === "markdown" && !state.file)
    ? { ...state, file: urlToFile(state.url!) } : state;

  const newPath = pageToPath(filled);

  if (newPath === location.pathname + location.search) return;

  navigate(newPath);
  }, [navigate, location.pathname, location.search]);

  /** 랜덤 문서 이동 */
  const goRandom = useCallback(() => {
    const url = getRandomDocUrl();
    if (url) pushPage({ type: "markdown", url });
  }, [pushPage]);

  return {
    page,
    pushPage,
    goRandom,
    location
  };
}

/** url -> 문서 경로 */
const urlToFile = (url: string) => URL_MAP.get(url)?.file;
/** 랜덤 문서 */
const getRandomDocUrl = () => 
  FLAT_DOCS.length ? FLAT_DOCS[Math.floor(Math.random() * FLAT_DOCS.length)].url : undefined;

function pathToPage(pathname: string, search?: string): PageState {
  /** 주소 -> 문서 */
  if (pathname.startsWith("/doc")) {
    const url = pathname.replace("/doc", "") || "/";
    return { type: "markdown", url, file: urlToFile(url) };
  }

  /** 주소 -> 검색 */
  if (pathname.startsWith("/search")) {
    const params = new URLSearchParams(search || window.location.search);
    return { type: "search", query: params.get("q") || "" };
  }

  /** 그 외 경로 + 홈 페이지 포함 */
  const type = ROUTE_MAP[pathname];
  return type ? ({ type } as PageState) : { type: "home" };
}
/** 페이지 -> 주소 */
function pageToPath(state: PageState): string {
  if (state.type === "markdown") return `/doc${state.url || "/"}`;
  if (state.type === "search") return `/search?q=${encodeURIComponent(state.query || "")}`;

  return PAGE_TO_PATH[state.type] ?? "/";
}
/** 이전/다음 문서 검색, 이미 선택한 건 취소 */
export function getNextPrevDocsSkipSameFile(currentUrl: string) {
  const idx = FLAT_DOCS.findIndex(d => d.url === currentUrl);
  if (idx === -1) return {};

  const currentFile = FLAT_DOCS[idx].file;

  /** 이전 */
  let prev;
  for (let i = idx - 1; i >= 0; i--) {
    if (FLAT_DOCS[i].file !== currentFile) {
      prev = { url: FLAT_DOCS[i].url, title: FLAT_DOCS[i].title };
      break;
    }
  }

  /** 다음 */
  let next;
  for (let i = idx + 1; i < FLAT_DOCS.length; i++) {
    if (FLAT_DOCS[i].file !== currentFile) {
      next = { url: FLAT_DOCS[i].url, title: FLAT_DOCS[i].title };
      break;
    }
  }

  return { prev, next };
}