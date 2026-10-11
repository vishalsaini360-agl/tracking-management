import ActionType from "../types";
const initialState = {
  firstexpandState:false,
  expandState: false,
  walletBalance: "",
};
export const sideBarReducer = (state = initialState, action) => {
  switch (action.type) {

    
    case ActionType.FIRSTCOLLASPSE:
      return {
        ...state,
        firstexpandState:action.payload
      };
    case ActionType.COLLAPSE:
      return {
        ...state,
        expandState: action.payload,
      };
    case ActionType.WALLETBALANCE:
      return {
        ...state,
        walletBalance: action.payload,
      };
    case ActionType.DATASYNCTIME:
      return {
        ...state,
        dataSyncTime: action.payload,
      };

    default:
      return state;
  }
};

export default sideBarReducer;
