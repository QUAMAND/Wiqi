import { useState, useEffect } from "react";
import "./versions.css";
import { Icon } from "../../common/Icon";
import { useSetting } from "../../../hooks/Settings";

interface VersionItem {
   type: string;
   version: string;
   date: string;
   contentPath: string;
}

export function Versions() {
   const { t } = useSetting();
   const [entries, setEntries] = useState<VersionItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [showCount, setShowCount] = useState(200);
   const [openVersions, setOpenVersions] = useState<Record<string, boolean>>({});
   const [versionContent, setVersionContent] = useState<Record<string, string>>({});

   // 버전 리스트 가져오기
   useEffect(() => {
      fetch("https://launchercontent.mojang.com/v2/javaPatchNotes.json")
         .then((res) => res.json())
         .then((json) => {
            setEntries(json.entries || []);
            setLoading(false);
         })
         .catch((err) => {
            console.error(err);
            setError(t.not_found_news);
            setLoading(false);
         });
   }, [t]);

   // 클릭 시 Technical Changes 토글
   const toggleVersion = async (entry: VersionItem) => {
      setOpenVersions((prev) => ({
         ...prev,
         [entry.version]: !prev[entry.version],
      }));

      if (versionContent[entry.version]) return;

      try {
         const res = await fetch(`https://launchercontent.mojang.com/v2/${entry.contentPath}`);
         const json = await res.json();

         const techChanges = extractTechnicalChanges(json.body || "");
         setVersionContent((prev) => ({
            ...prev,
            [entry.version]: techChanges,
         }));
      } catch (err) {
         console.error(err);
         setVersionContent((prev) => ({
            ...prev,
            [entry.version]: t.not_found_doc + entry.version,
         }));
      }
   };

   // HTML 문자열에서 Technical Changes 추출
   const extractTechnicalChanges = (html: string) => {
      if (!html) return t.not_found_doc;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const h1 = Array.from(doc.querySelectorAll("h1")).find((el) =>
         el.textContent?.toLowerCase().includes("technical change")
      );

      if (!h1) return html;

      let content = "";
      let next = h1.nextElementSibling;

      while (next && next.tagName !== "H1") {
         content += next.outerHTML;
         next = next.nextElementSibling;
      }

      return content || t.not_found_doc;
   };

   if (loading) return <p>{t.home.loading}</p>;
   if (error) return <p>{error}</p>;
   if (entries.length === 0) return <p>{t.not_found_news}</p>;

   const sortEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
   );

   const getVersionColor = (entry: VersionItem) => {
      if (entry.version.toLowerCase().includes("pre")) return "var(--accent-gold)";
      if (entry.type === "release") return "var(--accent-green)";
      return "var(--accent-red)";
   };

   return (
      <section className="Versions">
         <h2>{t.home.versions}</h2>

         <div className="Versions-container">
            <div className="Versions">
               <div className="Versions-graph"></div>

               {sortEntries.slice(0, showCount).map((entry) => (
                  <div
                     key={entry.version}
                     className="Version-item minimal"
                     onClick={() => toggleVersion(entry)}
                  >
                     <div className="Version-icon">
                        <Icon icon="git" size={16} color={getVersionColor(entry)} />
                     </div>

                     <div className="Version-content">
                        <span className="Version-tag">{entry.version}</span>
                        <span className="Version-title">{entry.type}</span>

                        <Icon icon="time" size={16} />
                        <span className="Version-date">
                           {new Date(entry.date).toLocaleDateString(t.date)}
                        </span>
                     </div>

                     {openVersions[entry.version] && (
                        <div
                           className="Version-technical markdown"
                           onClick={(e) => e.stopPropagation()}
                           dangerouslySetInnerHTML={{
                              __html: versionContent[entry.version] || t.home.loading,
                           }}
                        ></div>
                     )}
                  </div>
               ))}
            </div>

            {showCount < entries.length && (
               <button className="Versions-more" onClick={() => setShowCount(showCount + 200)}>
                  {t.home.loading}...
               </button>
            )}
         </div>
      </section>
   );
}