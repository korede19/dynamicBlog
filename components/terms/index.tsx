import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";

const Terms = () => {
  return (
    <div className={styles.pgContainer}>
      <h1>Terms of Service</h1>
      <p>
        Effective Date: 9th June, 2025
        <br />
        Welcome to PeakPurzuit! These Terms of Service govern your access to and
        use of our website located at{" "}
        <Link href="https://peakpurzuit.com">peakpurzuit.com</Link> By accessing
        or using the Site, you agree to comply with and be bound by these Terms.
        If you do not agree to these Terms, please do not use the Site.
      </p>
      <h2>1. Use of the Site</h2>
      <p>
        You agree to use the Site for lawful purposes only and in a manner
        consistent with all applicable local, national, and international laws
        and regulations. You are prohibited from:
      </p>
      <ul>
        <li>
          Posting or transmitting any material that is unlawful, harmful,
          defamatory, obscene, or otherwise objectionable.
        </li>
        <li>
          Engaging in any activity that could harm or disrupt the Site or its
          users.
        </li>
        <li>
          Attempting to gain unauthorized access to any portion of the Site or
          any other systems or networks connected to the site.
        </li>
      </ul>
      <h2>2. Intellectual Property Rights</h2>
      <p>
        All content on the Site, including text, graphics, logos, images, and
        software, is the property of <b>PeakPurzuit</b> or its content suppliers
        and is protected by international copyright laws. Unauthorized use,
        reproduction, or distribution of any content from the Site is strictly
        prohibited.
      </p>
      <h2>3. User Contributions</h2>
      <p>
        If you submit or post any content to the Site, including comments,
        suggestions, or other materials, you grant <b>PeakPurzuit</b> a
        non-exclusive, royalty-free, perpetual, and worldwide license to use,
        reproduce, modify, and distribute such content in any media. You
        represent and warrant that you own or have the necessary rights to the
        content you submit and that your content does not infringe upon the
        rights of any third party.
      </p>
      <h2>4. Third-Party Links</h2>
      <p>
        The Site may contain links to third-party websites or services that are
        not owned or controlled by <b>PeakPurzuit</b>. We are not responsible
        for the content, privacy policies, or practices of any third-party
        websites or services. We encourage you to read the terms and conditions
        and privacy policies of any third-party websites you visit.
      </p>
      <h2>5. Disclaimer of Warranties</h2>
      <p>
        The Site is provided on an as-is and as-available basis.
        <b>PeakPurzuit</b> makes no representations or warranties of any kind,
        express or implied, regarding the operation of the Site or the
        information, content, or materials included on the Site. You expressly
        agree that your use of the Site is at your sole risk.
      </p>
      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, <b>PeakPurzuit</b> shall not be
        liable for any damages of any kind arising from the use of the Site,
        including but not limited to direct, indirect, incidental, punitive, and
        consequential damages.
      </p>
      <h2>7. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless <b>PeakPurzuit</b>,
        its affiliates, and their respective officers, directors, employees, and
        agents from any claims, liabilities, damages, losses, or expenses,
        including reasonable attorneys&apos; fees, arising out of or in any way
        connected with your access to or use of the Site.
      </p>
      <h2>8. Changes to the Terms</h2>
      <p>
        <b>PeakPurzuit</b> reserves the right to modify or replace these Terms
        at any time. We will provide notice of any changes by updating the
        &quot;Effective Date&quot; at the top of these Terms. Your continued use
        of the Site after any such changes constitutes your acceptance of the
        new Terms.
      </p>
      <h2>9. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of Nigeria, without regard to its conflict of law principles.
      </p>
      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at:
        <br />
        Email: info@peakpurzuit.com
      </p>
    </div>
  );
};

export default Terms;
