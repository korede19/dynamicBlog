import React from "react";
import style from "./styles.module.css";
import { ourTeam } from "@/utils/data";

const OurTeam = () => {
  return (
    <div className={style.pgContainer}>
      <div className={style.pgcontain}>
        <h2>Our Team</h2>
        <p>
          Behind PeakPurzuit is a team of passionate designers, educators, and
          creative professionals dedicated to bringing you the best coloring
          content.
        </p>
        <div className={style.boxRow}>
          {ourTeam.map((item, index) => {
            return (
              <div key={index} className={style.offerBox}>
                <div className={style.offerIcon}>{item.icon}</div>
                <div className={style.offerText}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p> We are constantly innovating, adding new tips, and working to provide the best health and fitness experience possible!
        </p>
      </div>
    </div>
  );
};

export default OurTeam;
