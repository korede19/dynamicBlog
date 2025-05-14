"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

interface HeaderProps {
  navItems?: Array<{
    name: string;
    href: string;
  }>;
  logoText?: string;
}

const MegaMenu: React.FC<HeaderProps> = ({
  navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Posts", href: "/blog/posts" },
    { name: "Contact", href: "/contact" },
  ],
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.headerContainer}>
        <Link href="/">
          {" "}
          <Image
            src="/assets/newLogo.png"
            alt="Logo"
            width={120}
            height={120}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.mainNav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.name} className={styles.navItem}>
                <Link href={item.href} className={styles.navLink}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search and Login */}
        <div className={styles.headerActions}>
          {/* Search */}
          <div className={styles.searchContainer}>
            <button
              className={styles.searchToggle}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {searchOpen && (
              <div className={styles.searchOverlay}>
                <form
                  onSubmit={handleSearchSubmit}
                  className={styles.searchForm}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                  />
                  <button type="submit" className={styles.searchSubmit}>
                    Search
                  </button>
                  <button
                    type="button"
                    className={styles.searchClose}
                    onClick={() => setSearchOpen(false)}
                  >
                    ✕
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Login Button */}
          <Link href="/admin/login" className={styles.loginButton}>
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`${styles.mobileMenuIcon} ${
                mobileMenuOpen ? styles.mobileMenuOpen : ""
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuVisible : ""
        }`}
      >
        <nav>
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.name} className={styles.mobileNavItem}>
                <Link
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/login"
          className={styles.mobileLoginButton}
          onClick={() => setMobileMenuOpen(false)}
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default MegaMenu;
