/**
 * 제네릭 fetch wrapper
 * 모든 데이터 타입을 처리할 수 있습니다
 */
export async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/**
 * 텍스트 fetch (마크다운 등)
 */
export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}
