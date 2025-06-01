import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";
import Pinterest from "@/svg/pinterest";
import FooterSubscribe from "../footerForm";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.megaFooter}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <Image
                src="/assets/footerlogo.png"
                alt="Blog Logo"
                width={100}
                height={80}
                className={styles.logoImage}
              />
            </div>
            <p className={styles.footerDescription}>
              Your go-to source for insightful articles, news, and stories that
              matter. We deliver fresh perspectives and in-depth coverage on
              topics you care about.
            </p>
            <div className={styles.socialIcons}>
              <a
                href="https://www.pinterest.com/fineyx/"
                aria-label="Pinterest"
                className={styles.socialIcon}
                target="_blank"
              >
                <Pinterest />
              </a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Categories</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/blog/posts?category=category1">Fitness</Link>
              </li>
              <li>
                <Link href="/blog/posts?category=category2">Nutrition</Link>
              </li>
              <li>
                <Link href="/blog/posts?category=category3">
                  Health & Wellness
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              {/* <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li> */}
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <FooterSubscribe />
          </div>
        </div>
        <div className={styles.footerDivider}></div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} PeakPurzuit. All rights reserved.
          </p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
