import ActionType from "../types";
// import { _GET } from "../../services/axios.method";

export const checkIsLoggedInRequest = () => ({
  type: ActionType.CHECK_IS_LOGGED_IN_REQUEST,
});

export const checkIsLoggedInSuccess = (userData) => ({
  type: ActionType.CHECK_IS_LOGGED_IN_SUCCESS,
  payload: userData,
});

export const checkIsLoggedInFailure = (error) => ({
  type: ActionType.CHECK_IS_LOGGED_IN_FAILURE,
  payload: error,
});

export const loggedOut = (error) => ({
  type: ActionType.LOGGED_OUT,
  payload: error,
});



// Thunk function to check if the user is logged in
export const checkIsLoggedIn = () => {
  return async (dispatch) => {
    // dispatch(checkIsLoggedInRequest());
    try {
      // const response = await _GET("/auth/checkstatus");
      // console.log("response>>>>>>>>>", response.data.data);
      // console.log("response.data[0]>>>>>>>>>>>>", response.data.data[0]);
      // if (response?.data?.data && response.data.data.length > 0)
      //   dispatch(checkIsLoggedInSuccess(response?.data?.data[0]));

      dispatch(checkIsLoggedInSuccess());
    } catch (error) {
      dispatch(checkIsLoggedInFailure(error.message));
    }
  };
};
