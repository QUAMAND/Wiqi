import { DocumentFile, FlatDoc, PagePaths } from "../types";
import basic from "../data/page/docs/basic.json";
import advanced from "../data/page/docs/advanced.json";

/** 전체 문서 */
export const ALL_DOCS: DocumentFile[] = [...basic, ...advanced];
/** 문서 평탄화 */
export const FLAT_DOCS: FlatDoc[] = (function flatten(nodes: DocumentFile[]): FlatDoc[] {
  return nodes.reduce((array, node) => {
    array.push({ ...node, subtitle: node.subtitle ?? "" }); // subtitle 기본값 처리
    if (node.children) array.push(...flatten(node.children));
    return array;
  }, [] as FlatDoc[]);
})(ALL_DOCS);
/** url 맵 */
export const URL_MAP = new Map(FLAT_DOCS.map(doc => [doc.url, doc]));
/** 라우터 관련 */
export const ROUTE_MAP: Record<string, PagePaths> = {
  "/": "home",
  "/credits": "credits",
  "/versions": "versions",
  "/calc": "calc",
  "/editor": "editor",
};
/** type -> path */
export const PAGE_TO_PATH: Partial<Record<PagePaths, string>> = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([path, type]) => [type, path])
);