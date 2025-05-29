import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import WhatWeOffer from "../whatWeOffer";
import OurTeam from "../ourTeam";
import WhyChooseUS from "../whyChoose";
import JoinCommunity from "../joinCommunity";
import Footer from "../footer";
import Link from "next/link";

const AboutComponent = () => {
  return (
    <div>
      <div className={styles.aboutHeader}>
        <h1>About Us</h1>
        <p>
          About Us /{" "}
          <span>
            <Link href="/">Home</Link>
          </span>
        </p>
      </div>
      <div className={styles.aboutBody}>
        <p>
          Welcome to PeakPurzuit, your ultimate destination for all things
          health, fitness, and nutrition! Whether you&apos;re a gym enthusiast,
          a beginner on your wellness journey, or someone looking for
          expert-backed nutrition advice, our blog delivers actionable tips,
          workout guides, supplement insights, and motivational content to help
          you crush your goals. From breaking down the latest fitness trends and
          debunking diet myths to sharing effective training routines and
          recovery strategies, we&apos;re here to fuel your progress—one rep,
          meal, and mindset shift at a time. Get ready to transform your body,
          energize your life, and join a community that&apos;s all about
          strength, stamina, and sustainable health!
        </p>
        <div className={styles.aboutContent}>
          <div className={styles.imageBox}>
            <Image
              src={"/assets/fitness (2).jpg"}
              alt="About Us"
              width={500}
              height={500}
              className={styles.aboutImage}
            />
          </div>
          <div className={styles.aboutText}>
            <h2>Our Story</h2>
            <p>
              PeakPurzuit was born from a shared passion for fitness, nutrition,
              and the belief that everyone deserves access to reliable,
              no-nonsense health advice.
            </p>
            <p>
              It all started when a group of friends, headed by a gym rat
              (Fineyx), a longtime fitness enthusiast, noticed how overwhelming
              and often misleading the fitness industry could be. Between fad
              diets, questionable supplements, and conflicting workout trends,
              it was hard to know what actually worked. Frustrated by the
              misinformation, he set out to create a space where science,
              experience, and real-world results took center stage.
            </p>
            <p>
              What began as a small blog sharing gym tips and simple meal plans
              quickly grew into a trusted resource for thousands of readers.
              Today, our team includes certified trainers, nutritionists, and
              fitness veterans who are dedicated to one mission: helping you cut
              through the noise and achieve lasting results—without the
              gimmicks.
            </p>
            <p>
              We don&apos;t believe in quick fixes or one-size-fits-all
              approaches. Instead, we focus on sustainable training, smart
              nutrition, and the mindset shifts that lead to real, lifelong
              progress. This is more than just a blog—it&apos;s a community
              built on hard work, honesty, and a shared love for the grind.
              Whether you&apos;re lifting for strength, training for endurance,
              or just starting your fitness journey, we&apos;re here to guide
              you every step of the way.
            </p>
          </div>
        </div>
      </div>
      <WhatWeOffer />
      <OurTeam />
      <WhyChooseUS />
      <JoinCommunity />
      <Footer />
    </div>
  );
};

export default AboutComponent;
