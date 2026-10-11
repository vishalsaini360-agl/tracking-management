import React from "react";
import TokenLogin from "../component/login/TokenLogin";
import { APPLICATION_ROUTES, APP_ROLE } from "../utils/constants";
import {
  EbuxComponent,
  ALERTCONTROL,
  DASHBOARDComponent,
  UNAUTHORIZED,
} from "./dynaminRoutes";

const allRoles = [
  APP_ROLE.ADMIN,
  APP_ROLE.OWNER,
  APP_ROLE.ANALYST,
  APP_ROLE.MANAGER,
];

const availableRoutes = [
  {
    routePath: APPLICATION_ROUTES.TOKEN_LOGIN,
    component: TokenLogin,
    isPrivate: false,
    accessRoles: [APP_ROLE.ALL],
    visibleAfterLogin: true,
    sidebar: "/dashboard",
  },
  {
    routePath: APPLICATION_ROUTES.COMMONSCREEN,
    component: (props) => <EbuxComponent {...props} kpi="OSA" />,
    isPrivate: true,
    accessRoles: allRoles,
    visibleAfterLogin: true,
    sidebar: "/dashboard",
  },
  {
    routePath: APPLICATION_ROUTES.ALERTCONTROL,
    component: ALERTCONTROL,
    isPrivate: true,
    accessRoles: allRoles,
    visibleAfterLogin: true,
    sidebar: "/dashboard",
    showHeaderCalender: false,
  },
  {
    routePath: APPLICATION_ROUTES.ALERTCONTROLSUBPAGE,
    component: ALERTCONTROL,
    isPrivate: true,
    accessRoles: allRoles,
    visibleAfterLogin: true,
    sidebar: "/dashboard",
    showHeaderCalender: false,
  },
  {
    routePath: APPLICATION_ROUTES.UN_AUTHORISED,
    component: UNAUTHORIZED,
    isPrivate: true,
    accessRoles: [APP_ROLE.ADMIN, APP_ROLE.OWNER, APP_ROLE.ANALYST, APP_ROLE.MANAGER],
    visibleAfterLogin: true,
    sidebar: "/dashboard",
  },
  {
    routePath: APPLICATION_ROUTES.DASHBOARD,
    component: DASHBOARDComponent,
    isPrivate: false,
    accessRoles: allRoles,
    visibleAfterLogin: true,
    sidebar: "/dashboard",
  },
];

export default availableRoutes;
