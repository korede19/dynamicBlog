import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import ContactForm from "../contactForm";
import Gmail from "@/svg/mail";
// import Phone from "@/svg/phonee";

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
          <h2>Contact Details</h2>
          <p>
            Don&apos;t hesitate to contact us if you have any other questions,
            comments, or suggestions or just want to say Hello! We will try to
            accommodate all your requests.
          </p>
          <br />
          <br />
          <div className={styles.contactDetails}>
            {/* <div className={styles.phoneNo}>
              <Phone />
              <h2>Phone Number</h2>
              <p>+234 00 000 000 00</p>
            </div> */}
            <div className={styles.email}>
              <Gmail />
              <h2>Email</h2>
              <p>info@peakpurzuit.com</p>
            </div>
          </div>
        </div>
        <div className={styles.colTwo}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactComp;
