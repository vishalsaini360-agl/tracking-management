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
  const { role, requestStatus, platforms } = user_info;
  // let role = 'admin'
  const allowedPlatforms = _.map(platforms, 'platform_value');
  const hasAccess = [...allowedPlatforms, 'dashboard'].includes(platform);
  // console.log(">>>>>>>>>>>>>>>>>", user_info.requestStatus);
  // const { role } = useSelector((state) => state);
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (token) dispatch(checkIsLoggedIn());
  }, [token]);
  // let role = localStorage.getItem("role");
  // role = role ? role.toLowerCase() : undefined;
  // console.log("rest>>>>>>>>>>>>", role, rest.roles.includes(role));
  if (["loading"].includes(requestStatus) && token)
    return (
      <div className="w-full h-screen grid justify-items-stretch align-middle">
        <img
          className="w-1/6 justify-self-center inline-block align-middle mt-48 "
          src="/assets/images/egenie.gif"
          alt="loader"
        />
      </div>
    );
  // if (requestStatus === "succeeded")
  else {
    return (
      <CommonSidebar>

        <MainLayout>

          <Route
            {...rest}
            render={(props) => {
              if (!token || !role) {
                return (
                  <Redirect
                    to={{
                      pathname: APPLICATION_ROUTES.DASHBOARD,
                      state: { from: props.location },
                    }}
                  />
                );
              } else if (typeof blockForClient === 'function' ? blockForClient() : blockForClient) {
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
                  !rest.roles.includes(role.toLowerCase()) &&
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
