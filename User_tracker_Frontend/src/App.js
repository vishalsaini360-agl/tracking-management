/* eslint-disable */
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  // Route,
} from "react-router-dom";
// import MainLayout from "./component/common-components/main-layout";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import AuthManager from "./component/refresh/AuthManager";
import { PrivateRoute } from "./routes/PrivateRoute";
import { RestrictedRoute } from "./routes/RestrictedRoute";
import availableRoutes from "./routes/availableRoutes";
import { AuthProvider } from "./context/authContext";
import { APPLICATION_ROUTES } from "./utils/constants";
// import { createBrowserHistory } from "history";
// import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import StandardErrorBoundary from "./services/errorBoundary";
import { ScreenPath, setUserProperty } from "./analytics/EventController";
import ActivityTrackerProvider from "./tracker/ActivityTrackerProvider";
import config from "../src/appConfig.json";
import { EbuxProvider } from "./component/Ebux/Context/EbuxProvider";
import { MinMaxDateProvider } from "./component/Ebux/Context/MinMaxDateProvider";
import { ClientPermissionProvider } from "./context/ClientPermissionContext";
import { analytics } from "./services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { DarkStoreHelperProvider } from "./component/Ebux/Context/DarkStoreHelperProvider";


const ToastPortal = () =>
  createPortal(
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      containerStyle={{
        // style: {
        zIndex: 999999999999999,
        // },
      }}
    />,
    // <Toaster containerStyle={{ zIndex: 2000 }} />,
    document.body
  );
function App() {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  const user_info = useSelector((state) => state.AuthReducer);
  // const history = createBrowserHistory();
  // const location = useLocation();
  // const historyChange = () => {
  //   if (window.location.pathname !== history.location.pathname) {
  //     history.push(window.location.pathname);
  //   }
  // };

  // useEffect(() => {
  //   // history.listen(historyChange)
  // }, [historyChange]);
  console.log("history>>>>>>>>>>>>.", history);

  // useEffect(() => {
  //   dispatch(checkIsLoggedIn());
  // }, [window.location.pathname]);




  useEffect(() => {
    setUserProperty();

    window.dataLayer = window.dataLayer || [];
    const originalPush = window.dataLayer.push;

    window.dataLayer.push = function (arg) {
      if (
        arg &&
        typeof arg === "object" &&
        arg[0] === "event" &&
        arg[1] === "dashboard_data"
      ) {
        // return originalPush.call(this, arg[2]); 
        const { send_to, ...payloadWithoutSendTo } = arg[2];
        return originalPush.call(this, payloadWithoutSendTo);
      }
      return originalPush.apply(this, arguments);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurmentID}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      gtag("js", new Date());
      gtag("config", config.measurmentID);
    };

    return () => document.head.removeChild(script);
  }, []);

console.log("checking qa running or not?")
  return (
    <>
      <Router>
        {/* ScreenPath --- > to track page navigation in firebase */}
        <ScreenPath />
        <ActivityTrackerProvider />
        <AuthProvider>
          {/* <DateRangeProvider> */}
          <MinMaxDateProvider>
            <EbuxProvider>
              <DarkStoreHelperProvider>
              <ClientPermissionProvider>
              {/* <StandardErrorBoundary> */}
              <React.Suspense
                fallback={
                  <div className="w-full h-screen grid justify-items-stretch align-middle">
                    <img
                      className="w-1/6 justify-self-center inline-block align-middle mt-48 "
                      src="/assets/images/egenie.gif"
                      alt="loader"
                    />
                  </div>
                }
              >
                <Switch>
                  {availableRoutes.map((route, i) =>
                    route.isPrivate ? (
                      <PrivateRoute
                        blockForClient={route?.blockForClient ?? false}
                        key={route.routePath}
                        exact
                        user_info={user_info}
                        path={route.routePath}
                        roles={route.accessRoles}
                        component={route.component}
                        platform={_.trimStart(route?.sidebar, "/")}
                      />
                    ) : (
                      <RestrictedRoute
                        key={route.routePath}
                        exact
                        path={route.routePath}
                        user_info={user_info}
                        component={route.component}
                        visibleAfterLogin={route.visibleAfterLogin}
                      />
                    )
                  )}
                </Switch>
              </React.Suspense>

              <ToastPortal />
              {/* </StandardErrorBoundary> */}
              </ClientPermissionProvider>
               </DarkStoreHelperProvider>
            </EbuxProvider>
            </MinMaxDateProvider>
          {/* </DateRangeProvider> */}
        </AuthProvider>

        <AuthManager />
      </Router>
    </>
  );
}

export default App;
