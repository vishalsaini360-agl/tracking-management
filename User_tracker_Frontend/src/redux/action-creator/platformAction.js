import ActionType from "../types";

export const postPlatormData = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: ActionType.PLATFORM,
      payload: payload,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
