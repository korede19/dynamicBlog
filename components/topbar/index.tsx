import * as React from "react";
import styles from "./styles.module.css";
import Facebook from "@/svg/facebook";
import Twitter from "@/svg/twitter";
import Insatagram from "@/svg/instagram";
import Search from "@/svg/search";
import Link from "next/link";

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
          <div className={styles.loginBtn}>
            <button>
              <Link href="/admin/login">Login</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
