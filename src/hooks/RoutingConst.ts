import { DocNode, PageType } from "../types";
import basic from "../data/page/docs/basic.json";
import advanced from "../data/page/docs/advanced.json";

/** 상수 */
export const ALL_DOCS: DocNode[] = [...basic, ...advanced];
/** 문서 펼치기 */
export const FLAT_DOCS: DocNode[] = (function flatten(nodes: DocNode[]): DocNode[] {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    if (node.children) acc.push(...flatten(node.children));
    return acc;
  }, [] as DocNode[]);
})(ALL_DOCS);
/** url 맵 */
export const URL_MAP = new Map(FLAT_DOCS.map(doc => [doc.url, doc]));
/** 라우터 관련 */
export const ROUTE_MAP: Record<string, PageType> = {
  "/": "home",
  "/credits": "credits",
  "/versions": "versions",
  "/calc": "calc",
  "/editor": "editor",
};
/** type -> path */
export const PAGE_TO_PATH: Partial<Record<PageType, string>> = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([path, type]) => [type, path])
);