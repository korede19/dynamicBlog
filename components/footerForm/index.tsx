"use client";
import { useEffect, useState, FormEvent } from "react";
import styles from "./styles.module.css";

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL as string;

type SubmissionStatus = "idle" | "loading" | "success" | "error";

export default function FooterSubscribe() {
  const [mounted, setMounted] = useState(false);

  // Hydration-safe rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [message, setMessage] = useState<string>("");

  if (!mounted) return null; // prevent SSR mismatch

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          timestamp: new Date().toISOString(),
        }).toString(),
      });

      setStatus("success");
      setMessage(
        "Thank you for subscribing! You'll receive our latest updates."
      );
      setFirstName("");
      setLastName("");
      setEmail("");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setMessage("Failed to subscribe. Please try again later.");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      case "loading":
        return "#007bff";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className={styles.footerColumn}>
      <h3 className={styles.footerHeading}>Subscribe</h3>
      <p className={styles.subscribeText}>
        Join our newsletter to stay updated with our latest news and articles.
      </p>

      <form className={styles.subscribeForm} onSubmit={handleSubmit}>
        <div className={styles.nameGroup}>
          <input
            type="text"
            placeholder="First Name"
            className={styles.subscribeInput}
            aria-label="First Name"
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={status === "loading"}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className={styles.subscribeInput}
            aria-label="Last Name"
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
            disabled={status === "loading"}
            required
          />
        </div>
        <input
          type="email"
          placeholder="Your email address"
          className={styles.subscribeInput}
          aria-label="Email address"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          required
        />
        <button
          type="submit"
          className={styles.subscribeButton}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      <p className={styles.subscribeDisclaimer}>
        By subscribing, you agree to our Privacy Policy and consent to receive
        updates from our company.
      </p>

      {message && (
        <p
          style={{
            marginTop: "10px",
            color: getStatusColor(),
            fontSize: "14px",
            fontWeight: status === "success" ? "500" : "normal",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
