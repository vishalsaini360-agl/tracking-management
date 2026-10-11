import ActionType from "../types";

const initialState = {
    platformData: [],
};

export const platformReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case ActionType.PLATFORM:
      return {
        ...state,
        platformData: action.payload,
      };
    default:
      return state;
  }
};

export default platformReducer;
