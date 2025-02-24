import * as React from "react";
import styles from "./styles.module.css";
import { menuLinks } from "@/utils/data";
import Link from "next/link";
import Topbar from "../topbar";

const Header = () => {
  return (
    <>
      <Topbar />
      <div className={styles.sectionContain}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            {" "}
            <p> BLOGS PAGE </p>
          </div>
          <div className={styles.menuLinks}>
            {menuLinks?.map((items, index) => {
              return (
                <Link key={index} href={items.link}>
                  {items.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
