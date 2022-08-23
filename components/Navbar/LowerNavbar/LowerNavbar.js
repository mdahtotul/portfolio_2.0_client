import Link from "next/link";
import React from "react";
import { useStateContext } from "../../../context/ContextProvider";
import routes from "../../../routes/routes";
import styles from "./LowerNavbar.module.css";

const LowerNavbar = () => {
  const { pageURL, darkTheme } = useStateContext();

  // css conditionalClass for dark mode
  const conditionalClass = darkTheme ? styles.dark : styles.light;

  return (
    <div className={`${conditionalClass} ${styles.nav_sec}`}>
      <div className={styles.nav_wrapper}>
        <div className={styles.nav_links}>
          {routes.map((path, idx) => (
            <Link key={idx} href={path.to}>
              <span
                className={
                  pageURL === path.to ? styles.activeLink : styles.link
                }
                title={`Go to: ${path.to}`}
              >
                <span title={path.name} className={styles.link_icon}>
                  {path.icon}
                </span>
                <span className={styles.link_name}>{path.name}</span>
                <div className={styles.indicator}></div>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowerNavbar;
