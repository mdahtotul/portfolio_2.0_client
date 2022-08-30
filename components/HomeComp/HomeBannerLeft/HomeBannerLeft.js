import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Typewriter from "typewriter-effect";
import { useStateContext } from "../../../context/ContextProvider";
import styles from "./HomeBannerLeft.module.css";

const HomeBannerLeft = () => {
  const { currentColor, darkTheme } = useStateContext();

  // css conditionalMode for dark mode
  const conditionalMode = darkTheme ? styles.dark : styles.light;

  function handleMouseEnter(x) {
    console.log(x);
    // x.style.backgroundColor = currentColor;
    // x.style.color = "fff";
  }

  function handleMouseLeave(x) {}

  return (
    <div className={conditionalMode}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {
            scale: 0.8,
            opacity: 0,
          },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.4,
            },
          },
        }}
      >
        <p className={styles.greetings}>PEACE BE UPON YOU</p>
      </motion.div>
      <h2 className={styles.name}>
        Hi, I&apos;m{" "}
        <span
          style={{
            color: currentColor,
          }}
        >
          MD. ARIFUL HASAN
        </span>
      </h2>
      <div
        style={{
          color: currentColor,
        }}
        className={styles.type_writer}
      >
        <span className={styles.words}>a </span>
        <Typewriter
          options={{
            strings: ["Student", "Programmer", "MERN Developer"],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <p className={styles.about}>
        I&apos;m a self-motivated, innovative, task-driven web designer and
        developer with a passion for web designing and development. I always try
        to keep my work simple, clean and effective for other developers and
        users.
      </p>

      <div className={styles.banner_btn}>
        <Link href="">
          <span
            id="resume"
            className={styles.btn}
            style={{
              color: currentColor,
            }}
            // onMouseEnter={() => handleMouseEnter(this)}
            // onMouseLeave={() => handleMouseLeave(this)}
          >
            Download Resume
          </span>
        </Link>
        <Link href="/contact">
          <span
            id="contact"
            className={styles.btn}
            style={{
              color: currentColor,
            }}
            // onMouseEnter={handleMouseEnter(this)}
            // onMouseLeave={handleMouseLeave(this)}
          >
            Contact
          </span>
        </Link>
      </div>
    </div>
  );
};

export default HomeBannerLeft;
