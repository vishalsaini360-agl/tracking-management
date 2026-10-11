import ActionType from "../types";
const initialState = [];
export const permissionsReducer = (state = initialState, action) => {
  if (action.type === ActionType.PERMISSIONS_DETAILS) {
    return action.payload;
  }
  return state;
};

