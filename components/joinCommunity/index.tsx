import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";

const JoinCommunity = () => {
  return (
    <div className={styles.contain}>
      <Image
        src={"/assets/fitness.jpg"}
        alt="Join Community"
        width={500}
        height={300}
        className={styles.aboutImage}
      />
      <div className={styles.otherTexts}>
        <h2>Looking Ahead</h2>
        <p>
          As we grow, we remain committed to our core mission: delivering
          exceptional content that adds value to our readers&apos; lives.
          We&apos;re excited to explore new topics, formats, and ways to engage
          with our audience in the coming years.
          <br />
          <br />
          Thank you for being part of the PeakPurzuit journey. We appreciate
          every reader, sharer, and commenter who makes this community vibrant.
          <br />
          <br />
          Have questions or suggestions? Contact us here - we&apos;d love to
          hear from you!
        </p>
        <Link href="/contact" className={styles.contactLink}>
          <button className={styles.joinButton}> Contact Us </button>
        </Link>
      </div>
    </div>
  );
};

export default JoinCommunity;
