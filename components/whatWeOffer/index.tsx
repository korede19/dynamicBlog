import React from "react";
import styles from "./styles.module.css";
import { offers } from "@/utils/data";

const WhatWeOffer = () => {
  return (
    <div className={styles.pgContainer}>
      <div className={styles.pgcontain}>
        <h2>What We Offer</h2>
        <p>
          At PeakPurzuit, we provide science-backed, practical, and engaging
          content to help you level up your fitness, optimize your nutrition,
          and stay motivated on your health journey. Here&apos;s what you&apos;ll find:
        </p>
        <div className={styles.boxRow}>
          {offers.map((index, item) => {
            return (
              <div key={item} className={styles.offerBox}>
                <div className={styles.offerIcon}>{index.icon}</div>
                <div className={styles.offerText}>
                  <h3>{index.title}</h3>
                  <p>{index.body}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.otherTexts}>
          <p>
            Whether you&apos;re a gym newbie or a seasoned athlete, we&apos;ve got the
            knowledge and inspiration to help you perform at your best. Our team
            of experienced writers and subject matter experts works tirelessly
            to deliver content that is:
          </p>
          <ul>
            <li>Accurate and well-researched</li>
            <li>Engaging and easy to understand</li>
            <li>Practical and actionable </li>
            <li>Original and thought-provoking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
