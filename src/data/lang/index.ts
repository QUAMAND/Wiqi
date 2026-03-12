import ko from "./ko.json";
import en from "./en.json";

const files = { ko, en };
/* 파일 이름을 키로 변환합니다 */
export type LangKeys = keyof typeof files;

/*
 * 실제 번역 정보를 가져옵니다
 * lang key는 string입니다
 */
export const getI18n = (lang: LangKeys) => {
  return files[lang] ?? ko;
};

/*
 * key: value
 * e.g. "lang": "한국어", "lang": "English"
 */
export const LangItems = Object.entries(files).map(([key, value]) => ({
  key,
  value: value.lang,
}));
