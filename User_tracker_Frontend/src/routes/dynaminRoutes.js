import * as React from "react";

export const EbuxComponent = React.lazy(() => import("../pages/Ebux"));
export const DASHBOARDComponent = React.lazy(() => import("../pages/Dashboard"));
export const ALERTCONTROL = React.lazy(() => import("../pages/AlertControl"));
export const UNAUTHORIZED = React.lazy(() => import("../component/Unauthorized"));
