import ActionType from "../types";
import { safeJsonParse } from "../../utils/helpers";

// Define the initial state
const initialState = {
  isLoggedIn: false,
  role: undefined,
  name: undefined,
  user_id: undefined,
  // client_name: undefined,
  client_id: undefined,
  // currency_format: undefined,
  // currency_code: undefined,
  // currency: undefined,
  platforms: [],
  requestStatus: "loading",
  error: undefined,
};

// Create the reducer
export const authReducer = (state = initialState, action) => {
  // eslint-disable-next-line no-console
  // console.log("action>>>>>>>>>>", action.payload);
  switch (action.type) {
    case ActionType.CHECK_IS_LOGGED_IN_REQUEST:
      return {
        ...state,
        requestStatus: "loading",
      };
    case ActionType.CHECK_IS_LOGGED_IN_SUCCESS: {
      const storedPlatforms = safeJsonParse(localStorage.getItem("platforms"), {});
      const parsedPlatforms = Array.isArray(storedPlatforms?.platform)
        ? storedPlatforms.platform
        : Array.isArray(storedPlatforms)
        ? storedPlatforms
        : [];

      return {
        ...state,
        requestStatus: "succeeded",
        isLoggedIn: true,
        role: localStorage.getItem("role") || "admin",
        name: localStorage.getItem("name"),
        user_id: localStorage.getItem("user_id"),
        client_id: localStorage.getItem("client_id"),
        currency: localStorage.getItem("currency"),
        platforms: parsedPlatforms,
      };
    }
    case ActionType.CHECK_IS_LOGGED_IN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        role: undefined,
        name: undefined,
        user_id: undefined,
        // client_name: undefined,
        client_id: undefined,
        // currency_format: undefined,
        // currency_code: undefined,
        // currency: undefined,
        platforms: [],
        requestStatus: "failed",
        error: action.payload,
      };
    case ActionType.LOGGED_OUT:
      return {
        ...state,
        isLoggedIn: false,
        role: undefined,
        name: undefined,
        user_id: undefined,
        // client_name: undefined,
        client_id: undefined,
        // currency_format: undefined,
        // currency_code: undefined,
        // currency: undefined,
        platforms: [],
        requestStatus: "loading",
        error: action.payload,
      };

    default:
      return state;
  }
};
