import { useStateContext } from "@/context/ContextProvider";
import { REMOVE_PROFILE_DEVICE } from "@/services/graphql/mutation";
import { detectBrowser, detectDevice } from "@/services/utils/common";
import { failedToast } from "@/services/utils/toasts";
import styles from "@/styles/ThemeSettings.module.css";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { BsCheck } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import useSWR from "swr";
import SimpleButton from "../SimpleButton/SimpleButton";
import { themeColors } from "./themeColor";

const ThemeSettings = () => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["portfolio_2_0"]);
  const { darkTheme, currentColor, sidebar, setSidebar, setColor } =
    useStateContext();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(0);

  const [removeDevice] = useMutation(REMOVE_PROFILE_DEVICE);
  const ipDetailsRef = useRef(null);
  const ipData = ipDetailsRef.current;
  console.log(
    "🚀 ~ file: ThemeSettings.jsx:25 ~ ThemeSettings ~ ipData:",
    ipData
  );

  const [userId, setUserId] = useState("");

  const httpFetcher = (url) => fetch(url).then((res) => res.json());

  const {
    data,
    isLoading: isIPLoading,
    error,
  } = useSWR("https://api.db-ip.com/v2/free/self", httpFetcher);

  const handleLogout = async () => {
    try {
      const browser = detectBrowser(navigator);
      const { device, isMobile } = detectDevice(navigator);
      const { data } = await removeDevice({
        variables: {
          userId: userId,
          userIP: ipData?.ipAddress,
          onMobile: isMobile,
          userPlatform: device,
          userAgent: navigator?.userAgent,
          userBrowser: browser,
          ipRegion: ipData?.city,
          ipCountry: ipData?.countryName,
        },
      });

      removeCookie("portfolio_2_0");
      localStorage.removeItem("portfolioIdToken");
      localStorage.removeItem("isUserLoggedIn");
      window.location.replace("/");
    } catch (err) {
      console.log("🚀 ~ file: ThemeSettings.jsx:48 ~ handleLogout ~ err:", err);
      failedToast(darkTheme, "Failed to logout");
    }
  };

  const toggleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  const handleColorBtn = (name, color) => {
    setColor(name, color);
    toggleSidebar();
  };

  const goToProfile = () => router.push("/profile");

  // css conditionalMode for dark mode
  const conditionalMode = darkTheme ? styles.dark : styles.light;
  const conditionalSidebar = sidebar ? "" : styles.inactive;

  useEffect(() => {
    const id = localStorage.getItem("portfolioIdToken");
    const loggedIn = localStorage.getItem("isUserLoggedIn");
    setUserId(id || "");
    ipDetailsRef.current = data;
    loggedIn ? setIsUserLoggedIn(1) : setIsUserLoggedIn(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={`${conditionalMode} ${styles.theme_sec} ${conditionalSidebar}`}
      >
        <div className={styles.theme_wrapper}>
          <p className={styles.color_options}>Theme Colors</p>
          <div className={styles.color_sec}>
            {themeColors.map((item, idx) => (
              <button
                key={idx}
                type="button"
                title={item?.name}
                className={styles.theme_btn}
                style={{
                  background: item?.color,
                }}
                onClick={() => handleColorBtn(item?.name, item?.color)}
              >
                {item?.color === currentColor && (
                  <BsCheck className={styles.checkIcon} />
                )}
              </button>
            ))}
          </div>
          <div className={styles.profile_sec}>
            {isUserLoggedIn ? (
              <SimpleButton
                type="button"
                onClick={handleLogout}
                disabled={isIPLoading}
              >
                Logout
              </SimpleButton>
            ) : (
              <SimpleButton
                type="button"
                onClick={() => router.push("/login")}
                disabled={isIPLoading}
              >
                Login
              </SimpleButton>
            )}
            <SimpleButton type="button" onClick={goToProfile}>
              Profile Settings
            </SimpleButton>
          </div>
        </div>
      </div>
      <div
        title="Settings"
        className={styles.setting_icon}
        style={{
          background: currentColor,
        }}
        onClick={toggleSidebar}
      >
        <FiSettings className={styles.settings} />
      </div>
    </>
  );
};

export default ThemeSettings;
