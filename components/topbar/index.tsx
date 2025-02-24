import * as React from "react";
import styles from "./styles.module.css";
import Facebook from "@/svg/facebook";
import Twitter from "@/svg/twitter";
import Insatagram from "@/svg/instagram";
import Search from "@/svg/search";

const Topbar = () => {
  return (
    <>
      <div className={styles.pgContain}>
        <div className={styles.barContain}>
          <div className={styles.medias}>
            <Facebook />
            <Twitter />
            <Insatagram />
          </div>
          <div className={styles.searchForm}>
            <input type="text" placeholder="Search..." />
            <Search />
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
