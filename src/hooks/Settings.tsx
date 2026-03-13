import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getI18n, LangKeys } from "../data/lang";

type themes = "dark" | "light";
type langs = LangKeys;
type fonts = "main" | "code";

interface Props {
  theme: themes;
  lang: langs;
  font: fonts;
  nav: boolean;
  fixed: boolean;
}

/* 실제로 사용하는 설정 */
export const useSetting = () => {
  const context = useContext(SettingContext);

  if (!context) throw new Error("useSetting must be used inside Provider");

  return context;
};

/*
 * 전체 설정 값을 공유하기 위해 사용합니다
 */
export const SettingContext = createContext<{
  setting: Props;
  Update: <K extends keyof Props>(k: K, v: Props[K]) => void;
  t: ReturnType<typeof getI18n>;
} | null>(null);

/*
 * 제공자
 */
export const Provider = ({ children }: { children: ReactNode }) => {
    const getLang = (): langs => {
    const saved = localStorage.getItem("lang");
    if (saved === "ko" || saved === "en" || saved === "ja") return saved;
    return "ko";
  };

  const [setting, setSetting] = useState<Props>(() => ({
    theme: (localStorage.getItem("theme") as themes) || "dark",
    lang: getLang(),
    font: (localStorage.getItem("font") as fonts) || "main",
    nav: localStorage.getItem("nav") !== "false",
    fixed: localStorage.getItem("fixed") !== "false",
  }));

  const t = getI18n(setting.lang);

  const update = useCallback(<K extends keyof Props>(k: K, v: Props[K]) => {
    setSetting((p) => ({ ...p, [k]: v }));
  }, []);

  useEffect(() => {
    for (const k in setting) {
      localStorage.setItem(k, String(setting[k as keyof Props]));
    }
    // 테마 적용
    document.documentElement.setAttribute("data-theme", setting.theme);
  }, [setting]);

  return (
    <SettingContext.Provider value={{ setting, Update: update, t }}>
      {children}
    </SettingContext.Provider>
  );
};
