import { SelectState } from "../../App";
import { Line } from "../common/Line";
import { Group } from "./Group";
import { Item } from "./Item";

interface Props {
  docs: Page[][];
  page: SelectState;
  onSelect: (state: SelectState) => void;
}
export function Pages({ docs, page, onSelect }: Props) {
  return (
    <>
      {docs.map((s, i) => s.length > 0 && (
        <div key={i}>
          {/* 문단 나누기, e.g. jump-to-datapack과 fly-to-datapack을 나눔 */}
          {i > 0 && <Line width={0} height={36} />}
          {/* 실제 렌더링 */}
          {s.map((entry) => render(entry, page, onSelect))}
        </div>
      ))}
    </>
  );
}

interface Page {
  url: string;
  title: string;
  subtitle?: string;
  file?: string;
  children?: Page[];
}
function render(entry: Page, page: SelectState, onSelect: (url: SelectState) => void, depth = 0): React.ReactNode {
  {/* Item에 Group이 있을 때 */}
  if (entry.children?.length) {
    return (
      <div key={entry.url} style={{marginLeft: depth === 0 ? "12px" : ""}}>
        <Group key={entry.url} text={entry.title} count={entry.children.length} depth={depth}
          color={depth === 0 ? "var(--accent-blue)" : "var(--bg-bright-alpha)"}
          glow={"var(--bg-bright-alpha)"}
          fontSize={depth === 1 ? "0.8rem" : "0.95rem"}>

          {entry.children.map((child) => render(child, page, onSelect, depth + 1))}
        </Group>
      </div>
    );
  }

  {/* 아이템만 있을 때 */}
  return (
    <>
      <Item key={entry.url} icon="markdown" text={entry.title} depth={depth}
        select={page.url === entry.url}
        onClick={() => onSelect({ type: "markdown", url: entry.url, file: entry.file })}
        textColor={depth === 0 ? "var(--text-content)" : undefined} />
    </>
  );
}