import { useEffect, useState } from "react";
import { Icon } from "./common/Icon";
import "./home.css";
import { useSetting } from "../hooks/Settings";
import { useFetch } from "../hooks/useFetch";
import { fetchData } from "../utils/api";
import { NewsItem } from "../types";
import { Tooltip } from "./common/Tooltip";

interface HomeNewsProps {
  data: { entries: NewsItem[] } | null;
  loading: boolean;
}

function HomeNews({ data, loading }: HomeNewsProps) {
  const {t} = useSetting();
  const [news, setNews] = useState<NewsItem[]>([]);

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

function HomeVersions({ data, loading }: HomeNewsProps) {
  const {t} = useSetting();
  const [versions, setVersions] = useState<NewsItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!data) return;
    const sorted = [...data.entries]
      .sort((a: NewsItem, b: NewsItem) =>
        new Date(b.date) > new Date(a.date) ? 1 : -1
      )
      .slice(0, isExpanded ? 64 : 6);
    setVersions(sorted);
  }, [data, isExpanded]);

  return (
    <section className="Home-section">
      <h2>{t.home.versions}</h2>
      {loading ? (
        <p className="Home-loading">{t.home.loading}</p>
      ) : (
        <div className="Home-versions-container">
          <div className="Home-versions">
            <div className="Home-versions-graph" />
            {versions.map((item) => (
              <a
                key={item.version}
                href={`https://minecraft.wiki/w/Java_Edition_${item.version}`}
                target="_blank"
                rel="noreferrer"
                className="Home-version-item"
              >
                <Icon
                  icon="git"
                  size={16}
                  className={`Home-version-icon ${item.type}`}
                  color={item.type === "release" ? "var(--accent-green)" : "var(--accent-red)"}
                />
                <div className="Home-version-content">
                  <span className="Home-version-tag">{item.version}</span>
                  <span className="Home-version-title">{item.title}</span>
                  <span className="Home-version-date">
                    {new Date(item.date).toLocaleDateString(`${t.date}`)}
                  </span>
                </div>
              </a>
            ))}
          </div>
          <button
            className="Home-versions-more"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon icon="dropdown" size={20} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
            <span>{isExpanded ? "0..." : "64..."}</span>
          </button>
        </div>
      )}
    </section>
  );
}

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

      <HomeVersions data={data} loading={loading} />

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