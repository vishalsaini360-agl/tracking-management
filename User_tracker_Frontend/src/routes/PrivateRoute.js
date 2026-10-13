import * as React from "react";
import _ from "lodash";
import { Route, Redirect } from "react-router-dom";
import { APPLICATION_ROUTES } from "../utils/constants";
import MainLayout from "../component/common-components/main-layout";
import { useDispatch } from "react-redux";
import { checkIsLoggedIn } from "../redux/action-creator/authCreator";
import CommonSidebar from "../component/CommonSidebar/CommonSidebar";


export const PrivateRoute = ({
  blockForClient,
  component: Component,
  user_info,
  platform,
  // allowedRoles,
  ...rest
}) => {

  // eslint-disable-next-line no-console
  // console.log("etstsetestsetest")
  const dispatch = useDispatch();
  const { role: reduxRole, requestStatus, platforms } = user_info;
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const role = reduxRole || storedRole || "admin";

  const allowedPlatforms = Array.isArray(platforms)
    ? _.map(platforms, "platform_value")
    : [];
  const hasAccess = [...allowedPlatforms, "dashboard"].includes(platform);

  React.useEffect(() => {
    if (token) dispatch(checkIsLoggedIn());
  }, [token, dispatch]);

  if (["loading"].includes(requestStatus) && token && !storedRole && !reduxRole)
    return (
      <div className="w-full h-screen grid justify-items-stretch align-middle">
        <img
          className="w-1/6 justify-self-center inline-block align-middle mt-48 "
          src="/assets/images/egenie.gif"
          alt="loader"
        />
      </div>
    );
  else {
    return (
      <CommonSidebar>

        <MainLayout>

          <Route
            {...rest}
            render={(props) => {
              if (!token) {
                return (
                  <Redirect
                    to={{
                      pathname: APPLICATION_ROUTES.TOKEN_LOGIN,
                      state: { from: props.location },
                    }}
                  />
                );
              } else if (typeof blockForClient === "function" ? blockForClient() : blockForClient) {
                return (
                  <Redirect
                    to={{
                      pathname: APPLICATION_ROUTES.COMMONSCREEN,
                      state: { from: props.location },
                    }}
                  />
                );
              } else if (
                (token &&
                  role &&
                  rest.roles &&
                  !rest.roles.map((r) => String(r).toLowerCase()).includes(role.toLowerCase()) &&
                  requestStatus === "succeeded") || !hasAccess
              ) {
                // return <Redirect to="/unauthorized" />;
              }

              // if (roles.indexOf(authData.role) === -1) {
              //   return (
              //     <Redirect
              //       to={{
              //         pathname: APPLICATION_ROUTES.ERROR_PAGE,
              //       }}
              //     />
              //   );
              // }

              return (
                <>
                  <Component {...props} />
                </>
              );
            }}
          />
        </MainLayout>
      </CommonSidebar>
    );
  }
};
