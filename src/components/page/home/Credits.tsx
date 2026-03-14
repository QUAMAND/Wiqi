import { useSetting } from "../../../hooks/Settings"

import "./credits.css"


export function Credits() {
   const {t} = useSetting();

   return (
      <section className="Credits-section">
         <h2>{t.credits}</h2>

         <div className="Credits-group">
            <h3>{t.home.admin}</h3>
            <a
            href="https://github.com/QUAMAND"
            target="_blank"
            rel="noreferrer"
            className="Credits-person"
            >
            <span className="Credits-name">QUAMAND</span>
            </a>
         </div>

         <div className="Credits-group">
            <h3>{t.home.editor}</h3>
            <a
            href="https://github.com/QUAMAND"
            target="_blank"
            rel="noreferrer"
            className="Credits-person"
            >
            <span className="Credits-name">QUAMAND</span>
            </a>
         </div>

         <div className="Credits-group">
            <h3>{t.home.source}</h3>
            <div className="Credits-box">
            <a
               href="https://github.com/QUAMAND/Wiqi"
               target="_blank"
               rel="noreferrer"
               className="Credits-github"
            >
               <p>
                  {t.home.info_4}
               </p>
            </a>
            </div>
         </div>
      </section>
   )
}