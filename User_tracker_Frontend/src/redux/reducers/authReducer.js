import ActionType from "../types";

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
    case ActionType.CHECK_IS_LOGGED_IN_SUCCESS:
      return {
        ...state,
        requestStatus: "succeeded",
        isLoggedIn: true,
        // role: action.payload?.isLoggedIn ? action.payload.role : null,
        // name: action.payload?.isLoggedIn ? action.payload.username : null,
        // user_id: action.payload?.isLoggedIn ? action.payload.id : null,
        role: localStorage.getItem("role"),
        name: localStorage.getItem("name"),
        user_id: localStorage.getItem("user_id"),
        // client_name: action.payload.isLoggedIn
        //   ? action.payload.client_name
        //   : null,
        // client_id: action.payload.isLoggedIn ? action.payload.client_id : null,
        client_id: localStorage.getItem("client_id"),
        // currency_format: action.payload.isLoggedIn
        //   ? action.payload.currency_format
        //   : null,
        // currency_code: action.payload.isLoggedIn
        //   ? action.payload.currency_code
        //   : null,
        // currency: action.payload.isLoggedIn ? action.payload.currency : null,
        // platforms: action.payload?.isLoggedIn
        //   ? action.payload.platformDetails
        //   : [],

        currency: localStorage.getItem("currency"),
        platforms: localStorage.getItem("platforms")
          ? localStorage.getItem("platforms")
          : [],
      };
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
