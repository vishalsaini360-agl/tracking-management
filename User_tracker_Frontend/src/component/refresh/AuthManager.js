import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import CustomModal from "./CustomModal";
import { ONECOMMERCE_LOGIN_URL, IDENTITY_MODULE_BASE_URL} from "../../utils/url";

import { _POST } from "../../services/axios.method";

let refreshTokenTimeout;
const TOKEN_REFRESH_MARGIN = 5 * 60 * 1000; // 5 minutes before expiry

const IDLE_TIMEOUT = 300 * 1000; // 5 minutes = 300 seconds
// const IDLE_TIMEOUT = 15 * 1000; // 5 minutes = 300 seconds

export default function AuthManager() {
    const location = useLocation(); // Get the current route
    const [idToken, setIdToken] = useState(null);
    const [, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    // const [userName, setUserName] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

// ✅ move useRef inside the component
const isUserIdleRef = useRef(false);
const idleTimerRef = useRef(null);

  // ⭐ NEW: refs to keep latest token/username
  const refreshTokenRef = useRef(null);
  const userNameRef = useRef(null);


// ✅ useCallback also inside component
const resetIdleTimer = useCallback(() => {
  clearTimeout(idleTimerRef.current);
  isUserIdleRef.current = false;

  idleTimerRef.current = setTimeout(() => {
    isUserIdleRef.current = true;
  }, IDLE_TIMEOUT);
}, []);


useEffect(() => {
  const storedIdToken = localStorage.getItem("id_token");
  const storedAccessToken = localStorage.getItem("access_token");
  const storedRefreshToken = localStorage.getItem("refresh_token");
  const storedUserName = localStorage.getItem("name");

  setIdToken(storedIdToken);
  setAccessToken(storedAccessToken);
  setRefreshToken(storedRefreshToken);
  // setUserName(storedUserName);

   // ⭐ NEW: store in refs
   refreshTokenRef.current = storedRefreshToken;
   userNameRef.current = storedUserName;

  if (
    location.pathname !== "/login" &&
    storedIdToken &&
    storedAccessToken &&
    storedRefreshToken
  ) {
    // 👉 move scheduling here directly with local values
    scheduleTokenRefresh(storedAccessToken, storedRefreshToken);
  }
}, [location.pathname]);

      useEffect(() => {
        // console.log('sdsdsd')
        const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
        events.forEach((event) => window.addEventListener(event, resetIdleTimer));
        resetIdleTimer(); // Start on mount
    
        return () => {
          events.forEach((event) =>
            window.removeEventListener(event, resetIdleTimer)
          );
          clearTimeout(idleTimerRef.current);
        };
      }, [resetIdleTimer]);

    // const [refreshTokenData] = useState(null);


    // 🆕 Reset idle timer on activity
  // function resetIdleTimer() {
  //   clearTimeout(idleTimer);
  //   idleTimer = setTimeout(() => {
  //     console.log("User idle. Showing modal...");
  //     setIsModalOpen(true); // 🆕 Trigger modal on idle
  //   }, IDLE_TIMEOUT);
  // }

  // 🆕 Optional: Auto logout if modal stays open too long
  useEffect(() => {
    let autoLogoutTimer;
    if (isModalOpen) {
      autoLogoutTimer = setTimeout(() => {
        // console.log("Auto logout due to no user response");
        logout();
      }, 5*60 * 1000); // 1 minute auto logout
    }

    return () => clearTimeout(autoLogoutTimer);
  }, [isModalOpen]); // 🆕


  function decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      // console.error("Invalid token", error);
      return null;
    }
  }
  

  function scheduleTokenRefresh(accessToken, refreshToken) {
    // console.log('dsddsdd')
    if (!accessToken || !refreshToken) return;
  
    const decoded = decodeToken(accessToken);
    // console.log('decoded',decoded.exp)
    if (!decoded || !decoded.exp) return;
    // console.log('decodeddecoded',decoded)
    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const refreshAt = expiresAt - TOKEN_REFRESH_MARGIN;
    const delay = refreshAt - Date.now();
    // console.log('delaydelay',delay)
    if (delay > 0) {
        clearTimeout(refreshTokenTimeout);
        refreshTokenTimeout = setTimeout(handleOpenPopup, delay, refreshToken);
        // refreshTokenTimeout = setTimeout(handleOpenPopup, 20*1000, refreshToken);
        // refreshTokenTimeout = setInterval(() => {
        //   handleOpenPopup(refreshToken);
        // }, 5000);
    }
  }

  async function handleOpenPopup() {
    // console.log("⏰ handleOpenPopup called");
  
    const isUserIdle = isUserIdleRef?.current;
    // console.log("isUserIdle:", isUserIdle);
  
    if (isUserIdle) {
      // console.log("🛑 User is idle. Showing modal.");
      setIsModalOpen(true);
    } else {
      // console.log("✅ User is active. Refreshing token...");
      await handleRefreshTokens();
    }
  }

  async function handleRefreshTokens() {
    try {
      const currentRefreshToken = refreshTokenRef.current;
    const currentUserName = userNameRef.current;

    if (!currentRefreshToken || !currentUserName) {
      logout();
      return;
    }

      const payload = {
        refresh_token: currentRefreshToken,
        username: currentUserName,
      };
      
      const response = await _POST(`${IDENTITY_MODULE_BASE_URL}user/refreshToken`, payload, 
      {
        headers: {
          idtoken:idToken
        },
      }
    );
    const data = response?.data || null;
    // console.log('datadata',data?.data?.id_token)
       if (!data || !data?.isSuccess) {
        console.log('errr')
         logout();
       }
       
       const newAccessToken = data?.data?.access_token;
       const newIdToken = data?.data?.id_token;
       localStorage.setItem("id_token",newIdToken);
      localStorage.setItem("access_token",newAccessToken);
      refreshTokenRef.current = currentRefreshToken;

      //  console.log("Token refreshed successfully");
       setIsModalOpen(false)
       scheduleTokenRefresh(newAccessToken, refreshToken);
       
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  }

  function logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = ONECOMMERCE_LOGIN_URL;
  }

  return (
    <CustomModal
      isOpen={isModalOpen}
      onClose={logout}
      onConfirm={handleRefreshTokens}
    />
  );
}