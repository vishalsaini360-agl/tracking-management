/* eslint-disable no-console */
import ActionType from "../types";

export const setLoading = (state, buttonFlag) => async (dispatch) => {
  dispatch({
    type: ActionType.LOADING_STATE,
    payload: { state, buttonFlag },
  });
};

export const setExpandTable = (state) => async (dispatch) => {
  dispatch({
    type: ActionType.EXPANDTABLE,
    payload: state,
  });
};

export const setPlatformType = (state) => async (dispatch) => {
  dispatch({
    type: ActionType.SETHEADER,
    payload: state,
  });
};
export const clearToastMessageHandler = () => async (dispatch) => {
  dispatch({
    type: ActionType.TOASTMESSAGE,
    payload: { message: "", status: null },
  });
};

export const setToastMessageHandler = (message, status) => async (dispatch) => {
  console.log("ActionType.TOASTMESSAGE>>>>>>>>>", message, status);
  dispatch({
    type: ActionType.TOASTMESSAGE,
    payload: { message, status },
  });

  setTimeout(() => {
    dispatch({
      type: ActionType.TOASTMESSAGE,
      payload: { message: "", status: null },
    });
  }, 3000);
};
