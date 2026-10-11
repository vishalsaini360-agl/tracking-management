import * as React from "react";
// import { Route, Redirect, RouteProps } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";

import { APPLICATION_ROUTES } from "../utils/constants";

export const RestrictedRoute = ({
  component: Component,
  visibleAfterLogin,
  ...rest
}) => {
  const token = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(props) => {
        if (token && !visibleAfterLogin) {
          return (
            <Redirect
              to={{
                pathname: APPLICATION_ROUTES.DASHBOARD,
                state: { from: props.location },
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};
