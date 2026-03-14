import { useEffect, useState } from "react";
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
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (!data) return;

    const entries = [...data.entries];
    const sortByDateDesc = (a: NewsItem, b: NewsItem) =>
      new Date(b.date).getTime() - new Date(a.date).getTime();

    const latestRelease = entries
      .filter((item) => item.type === "release")
      .sort(sortByDateDesc)[0];
    const latestSnapshot = entries
      .filter((item) => item.type === "snapshot")
      .sort(sortByDateDesc)[0];

    const latest: NewsItem[] = [];
    if (latestSnapshot) latest.push(latestSnapshot);
    if (latestRelease) latest.push(latestRelease);

    // 릴리스/스냅샷을 날짜 기준 최신순으로 정렬
    latest.sort(sortByDateDesc);

    setNews(latest);
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
          <a
            href="https://mojira.dev"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_mojira}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.mojira}</span>
          </a>
          <a
            href="https://www.mcc-gadgets.com/java/changelog"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_mccgadgets}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.mccgadgets}</span>
          </a>
          <a
            href="https://mcstacker.net"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_mcstacker}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.mcstacker}</span>
          </a>
          <a
            href="https://misode.github.io"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_misode}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.misode}</span>
          </a>
          <a
            href="https://mcsrc.dev"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_mcsrc}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.mcsrc}</span>
          </a>
          <a
            href="https://bdengine.app"
            target="_blank"
            rel="noreferrer"
            className="Home-link-item"
          >
            <strong>
              {t.home.link_bdengine}
              <Icon icon="link" size={16} color="var(--accent-blue)" />
            </strong>
            <span>{t.home.bdengine}</span>
          </a>
        </div>
      </section>

      <br />
    </div>
  );
}