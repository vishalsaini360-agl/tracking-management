import ActionType from "../types";

let platform_type = JSON.parse(localStorage.getItem("platform_type"));
if (!platform_type) {
  localStorage.setItem("platform_type", JSON.stringify("/flipkart"));
  platform_type = JSON.parse(localStorage.getItem("platform_type"));
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
