import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "../contactForm";

const ContactComp = () => {
  return (
    <div>
      <div className={styles.aboutHeader}>
        <h1>Contact Us</h1>
        <p>
          Contact Us /{" "}
          <span>
            <Link href="/">Home</Link>
          </span>
        </p>
      </div>
      <div className={styles.aboutBody}>
        <div className={styles.colOne}>
          <Image
            src="/assets/contact.webp"
            alt="Contact Us"
            width={500}
            height={300}
            className={styles.aboutImage}
          />
        </div>
        <div className={styles.colTwo}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactComp;
