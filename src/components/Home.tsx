import { useEffect, useState } from "react";
import { Icon } from "./common/Icon";
import "./home.css";
import { useSetting } from "../hooks/Settings";
import { useFetch } from "../hooks/useFetch";
import { fetchData } from "../utils/api";
import { NewsItem } from "../types";
import { Tooltip } from "./common/Tooltip";

function HomeNews() {
  const {t} = useSetting();
  const [news, setNews] = useState<NewsItem[]>([]);

  const { data, loading } = useFetch(() =>
    fetchData<{ entries: NewsItem[] }>("https://launchercontent.mojang.com/v2/javaPatchNotes.json")
  );

  useEffect(() => {
    if (!data) return;
    const sorted = [...data.entries]
      .sort((a: NewsItem, b: NewsItem) =>
        new Date(b.date) > new Date(a.date) ? 1 : -1
      )
      .slice(0, 3);
    setNews(sorted);
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
            <Tooltip text={item.version}>
              <a
                key={item.version}
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
                    {item.type === "release" ? <Icon icon="version" size={12} color="var(--accent-green)"/> : <Icon icon="version" size={12} color="var(--accent-red)"/>}
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

export function Home() {
  const {t} = useSetting();
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

      <HomeNews />

      <section className="Home-section">
        <h2>{t.home.link}</h2>
        <div className="Home-links">
          <a
            href="https://www.minecraft.net"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_official}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.official}</span>
          </a>
          <a
            href="https://minecraft.wiki"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_wiki}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.wiki}</span>
          </a>
        </div>
      </section>

      <br />

      <section className="Home-section Home-credits">
        <h2>{t.credits}</h2>

        <div className="Home-credits-group">
          <h3>{t.home.admin}</h3>
          <a
            href="https://github.com/QUAMAND"
            target="_blank"
            rel="noreferrer"
            className="Home-credits-person"
          >
            <span className="Home-credits-name">QUAMAND</span>
          </a>
        </div>

        <div className="Home-credits-group">
          <h3>{t.home.editor}</h3>
          <a
            href="https://github.com/QUAMAND"
            target="_blank"
            rel="noreferrer"
            className="Home-credits-person"
          >
            <span className="Home-credits-name">QUAMAND</span>
          </a>
        </div>

        <div className="Home-credits-group">
          <h3>{t.home.source}</h3>
          <div className="Home-info-box">
            <a
              href="https://github.com/QUAMAND/Wiqi"
              target="_blank"
              rel="noreferrer"
              className="Home-credits-github"
            >
              <p>
                {t.home.info_4}
              </p>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}