import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.megaFooter}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <Image
                src="/assets/newLogo.png"
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
                href="https://twitter.com/"
                aria-label="Twitter"
                className={styles.socialIcon}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="https://facebook.com/"
                aria-label="Facebook"
                className={styles.socialIcon}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://instagram.com/"
                aria-label="Instagram"
                className={styles.socialIcon}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://linkedin.com/"
                aria-label="LinkedIn"
                className={styles.socialIcon}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
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
                <Link href="//blog/posts?category=category2">Nutrition</Link>
              </li>
              <li>
                <Link href="//blog/posts?category=category3">
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
            <h3 className={styles.footerHeading}>Subscribe</h3>
            <p className={styles.subscribeText}>
              Join our newsletter to stay updated with our latest news and
              articles.
            </p>
            <form className={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.subscribeInput}
                aria-label="Email address"
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </form>
            <p className={styles.subscribeDisclaimer}>
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates from our company.
            </p>
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
