import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { ourvalues } from "@/utils/data";

const WhyChooseUS = () => {
  return (
    <>
      <div className={styles.pgContainer}>
        <div className={styles.pgContain}>
          <Image
            src={"/assets/nutrition.jpg"}
            alt="About Us"
            width={500}
            height={300}
            className={styles.aboutImage}
          />
          <div className={styles.otherTexts}>
            <h2>Why Readers Choose PeakPurzuit</h2>
            <p>
              <b>Quality Content</b>: Every article undergoes rigorous research
              and editing
            </p>
            <p>
              <b>Diverse Perspectives</b>: We feature voices from various
              backgrounds and expertise
            </p>

            <p>
              <b>Reader-Focused Approach</b>: We listen to our audience and
              create content that matters to them
            </p>

            <p>
              <b>Clean Design</b>: Enjoy a seamless reading experience without
              intrusive ads
            </p>

            <p>
              <b>Regular Updates</b>: Fresh content published weekly to keep you
              informed
            </p>
          </div>
        </div>
      </div>
      <div className={styles.valuesTab}>
        <h2>Our Values</h2>
        <div className={styles.valuesTexts}>
          {ourvalues.map((index, item) => {
            return (
              <div key={item} className={styles.valuesBox}>
                <div className={styles.valuesIcon}>{index.icon}</div>
                <div className={styles.valuesText}>
                  <h3>{index.title}</h3>
                  <p>{index.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WhyChooseUS;
