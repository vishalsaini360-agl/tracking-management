// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import config from "../appConfig.json";
// import { isSupported } from "@firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = config.firebaseConfig;

// Initialize Firebase
const app = initializeApp({
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
});
export const analytics = getAnalytics(app);

// function loadGtagScript(measurementId) {
//   return new Promise((resolve) => {
//     if (window.gtag) return resolve();

//     const script = document.createElement("script");
//     script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
//     script.async = true;
//     script.onload = () => {
//       window.dataLayer = window.dataLayer || [];
//       window.gtag = function () {
//         window.dataLayer.push(arguments);
//       };
//       window.gtag("js", new Date());
//       window.gtag("config", measurementId);
//       resolve(); // Wait until it's fully ready
//     };

//     document.head.appendChild(script);
//   });
// }

// export const analyticsPromise = isSupported()
//   .then(async (supported) => {
//     // console.log(supported,'suppppppp')
//     if (!supported) return null;
//     // console.log(measurementId,'measureeee')
//     // await loadGtagScript(measurementId);
//     // console.log('dodononneonenenne') 
//     return getAnalytics(app);
//   })
//   .catch((err) => {
//     console.error("Analytics not supported:", err);
//     return null;
//   });
