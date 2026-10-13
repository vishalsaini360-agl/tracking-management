import ActionType from "../types";
import { safeJsonParse } from "../../utils/helpers";

let platform_type = safeJsonParse(localStorage.getItem("platform_type"), null);
if (!platform_type) {
  localStorage.setItem("platform_type", JSON.stringify("/flipkart"));
  platform_type = safeJsonParse(localStorage.getItem("platform_type"), "/flipkart");
}

const initialState = {
  loading: {
    state: false,
    buttonFlag: null,
  },
  toastErrorHandler: {
    message: "",
    status: null,
  },
  expandTable: true,
  platFormType: platform_type,
};
export const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOADING_STATE:
      return {
        ...state,
        loading: { ...action.payload },
      };
    case ActionType.TOASTMESSAGE:
      return {
        ...state,
        toastErrorHandler: { ...action.payload },
      };
    case ActionType.EXPANDTABLE:
      return {
        ...state,
        expandTable: action.payload,
      };
    case ActionType.SETHEADER:
      return {
        ...state,
        platFormType: action.payload,
      };
    default:
      return state;
  }
};

export default commonReducer;
