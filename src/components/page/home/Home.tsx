import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../common/Icon";
import "./home.css";
import { useSetting } from "../../../hooks/Settings";
import { useFetch } from "../../../hooks/useFetch";
import { fetchData } from "../../../utils/api";
import { NewsItem } from "../../../types";
import { Tooltip } from "../../common/Tooltip";

interface HomeNewsProps {
  data: { entries: NewsItem[] } | null;
  loading: boolean;
}

function HomeNews({ data, loading }: HomeNewsProps) {
  const {t} = useSetting();

  const news = useMemo(() => {
  if (!data) return [];

  const sortByDateDesc = (a: NewsItem, b: NewsItem) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  const entries = data.entries;
  const latestRelease = entries.filter((item) => item.type === "release").sort(sortByDateDesc)[0];
  const latestSnapshot = entries.filter((item) => item.type === "snapshot").sort(sortByDateDesc)[0];

  return [latestSnapshot, latestRelease].filter(Boolean).sort(sortByDateDesc);
}, [data]);

  return (
    <section className="Home-section">
      <h2>{t.home.news}</h2>
      {loading ? (
        <p className="Home-loading">{t.home.loading}</p>
      ) : news.length === 0 ? (
        <p className="Home-loading">{t.not_found_news}</p>
      ) : (
        <div className="Home-news">
          {news.map((item) => (
            <Tooltip text={item.version} key={item.version}>
              <a
                href={`https://minecraft.wiki/w/Java_Edition_${item.version}`}
                target="_blank"
                rel="noreferrer"
                className="Home-news-item"
              >
                <img
                  src={`https://launchercontent.mojang.com${item.image.url}`}
                  alt={item.title}
                />
                <div>
                  <span className="Home-news-date">
                    <Icon icon="time" size={12} />
                    &nbsp;
                    {new Date(item.date).toLocaleDateString(`${t.date}`)}
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <Icon icon="version" size={12} color={item.type === "release" ? "var(--accent-green)" : "var(--accent-red)"} />
                    &nbsp;
                    <span
                      className={
                        item.type === "release"
                          ? "Home-news-release"
                          : "Home-news-snapshot"
                      }
                    >
                      {item.type === "release" ? `${t.release}` : `${t.snapshot}`}
                    </span>
                  </span>
                  <p className="Home-news-title">{item.title}</p>
                  <p className="Home-news-desc">{item.shortText}</p>
                </div>
              </a>
            </Tooltip>
          ))}
        </div>
      )}
    </section>
  );
}

const LINKS = [
  { key: "official",   href: "https://www.minecraft.net" },
  { key: "wiki",       href: "https://minecraft.wiki" },
  { key: "mojira",     href: "https://mojira.dev/?project=MC" },
  { key: "mccgadgets", href: "https://www.mcc-gadgets.com/java/changelog" },
  { key: "mcstacker",  href: "https://mcstacker.net" },
  { key: "misode",     href: "https://misode.github.io" },
  { key: "mcsrc",      href: "https://mcsrc.dev" },
  { key: "bdengine",   href: "https://bdengine.app" },
  { key: "brigadier",  href: "https://github.com/Mojang/brigadier" },
] as const;
export function Home() {
  const {t} = useSetting();
  const { data, loading } = useFetch(() =>
    fetchData<{ entries: NewsItem[] }>("https://launchercontent.mojang.com/v2/javaPatchNotes.json")
  );

  return (
    <div className="Home">

      <section className="Home-hero">
        <h1>{t.title}</h1>
        <div className="Home-info-box">
          <p>
            {t.home.info_1}
            <br/>
            {t.home.info_2}
            <br/>
            <br/>
            {t.home.info_3}
          </p>
        </div>
      </section>

      <HomeNews data={data} loading={loading} />

      <section className="Home-section">
        <h2>{t.home.link}</h2>
        <div className="Home-links">
          {LINKS.map(({ key, href }) => (
            <a key={key} href={href} target="_blank" rel="noreferrer" className="Home-link-item">
              <strong>
                {t.home[`link_${key}` as keyof typeof t.home]}
                <Icon icon="link" size={16} color="var(--accent-blue)" />
              </strong>
              <span>{t.home[key as keyof typeof t.home]}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}