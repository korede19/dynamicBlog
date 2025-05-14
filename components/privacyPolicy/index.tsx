import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className={styles.pgContainer}>
      <h1>Privacy Policy</h1>
      <p>
        Effective Date: 9th June, 2025
        <br />
        At PeakPurzuit, accessible from{" "}
        <Link href="https://peakpurzuit.com">peakpurzuit.com</Link>, we
        prioritize the privacy of our visitors. This Privacy Policy outlines the
        types of information we collect and how we use, disclose, and safeguard
        your information.
      </p>
      <h2>1. Information We Collect</h2>
      <p>We may collect and process the following data:</p>
      <ul>
        <li>
          Personal Identification Information: Name, email address, and any
          other information you voluntarily provide when subscribing to our
          newsletter or contacting us.
        </li>
        <li>
          Non-Personal Identification Information: Browser type, Internet
          Service Provider (ISP), referring/exit pages, and date/time stamps.
        </li>
        <li>
          Cookies and Tracking Technologies: We use cookies to enhance user
          experience, analyze site traffic, and personalize content.
        </li>
      </ul>
      <h2>2. How We Use Your Information</h2>
      <p>We use the collected information for various purposes:</p>
      <ul>
        <li>To provide, operate, and maintain our website.</li>
        <li>To improve, personalize, and expand our website.</li>
        <li>To improve, personalize, and expand our website.</li>
        <li>To develop new products, services, features, and functionality.</li>
        <li>
          To communicate with you, including sending newsletters and updates.
        </li>
        <li>
          To prevent fraudulent activities and ensure the security of our
          website.
        </li>
      </ul>
      <h2>3. Sharing Your Information</h2>
      <p>
        We do not sell, trade, or rent your personal identification information
        to others. However, we may share generic aggregated demographic
        information not linked to any personal identification information with
        our business partners and advertisers.
      </p>
      <h2>4. Third-Party Services</h2>
      <p>
        We may use third-party services such as Google Analytics and advertising
        partners. These third parties have their own privacy policies addressing
        how they use such information.
      </p>
      <h2>5. Your Data Protection Rights</h2>
      <p>Depending on your location, you may have the following rights:</p>
      <ul>
        <li>
          The right to access - You have the right to request copies of your
          personal data.
        </li>
        <li>
          The right to rectification - You can request correction of any
          information you believe is inaccurate.
        </li>
        <li>
          The right to erasure - You can request that we erase your personal
          data, under certain conditions.
        </li>
        <li>
          The right to restrict processing - You can request that we restrict
          the processing of your personal data, under certain conditions.
        </li>
        <li>
          The right to object to processing - You can object to our processing
          of your personal data, under certain conditions.
        </li>
        <li>
          The right to data portability - You can request that we transfer the
          data we have collected to another organization, or directly
        </li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
