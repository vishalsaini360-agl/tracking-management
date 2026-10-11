import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  sideBarReducer,
  commonReducer,
  platformReducer,
  authReducer,
  permissionsReducer,
} from "./reducers";

const rootReducer = combineReducers({
  SideBarReducer: sideBarReducer,
  CommonReducer: commonReducer,
  PlatformReducer: platformReducer,
  AuthReducer: authReducer,
  permissionsReducer: permissionsReducer,
});

const middleware = [thunk];
const composeEnacher = composeWithDevTools({ trace: true, traceLimit: 25 });
const STORE = createStore(
  rootReducer,
  composeEnacher(applyMiddleware(...middleware))
);

export default STORE;
