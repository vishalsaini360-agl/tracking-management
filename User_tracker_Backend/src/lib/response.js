const constants = require("../constants/constants");
const APP_DEBUG_ERROR_MESSAGE = process?.env?.APP_DEBUG_ERROR_MESSAGE??false;

async function getErrorMessage(errCode) {
  let resMessage;
  switch (errCode) {
    case constants.response_code.JWT:
      resMessage = "Invalid Access Token!";
      break;

    case constants.response_code.INVALID_ID:
      resMessage = "Invalid user";
      break;

    case constants.response_code.UNAUTHORIZED:
      resMessage = "You are not authorized!";
      break;

    case constants.response_code.FORBIDDEN:
      resMessage = "This action is forbidden for you!";
      break;

    case constants.response_code.ROLE_BREACH:
      resMessage = "You are not authorize to perform this action!";
      break;

    case constants.response_code.NOT_FOUND:
      resMessage = "Data not found";
      break;

    case constants.response_code.EMPTY_REQ:
      resMessage = "Empty data set cannot be processed";
      break;

    default:
      resMessage = "Some unknown error occurred!";
      break;
  }
  return resMessage;
}

module.exports = {
  async sendResponse(resCode, resMessage, data, res, error) {
    if (resCode > constants.response_code.MAX_SUCCESS_CODE) {
      resMessage = String(APP_DEBUG_ERROR_MESSAGE)=="true"?(resMessage || getErrorMessage(resCode)):"Whoops, looks like something went wrong.";
      data = Array.isArray(data)?[]:{};
    }
    res.status(resCode).json({
      status: {
        code: resCode,
        message: resMessage,
      },
      data: data,
      error,
    });
  },

   async  successResponse (res, message = "Success", data = {}, status = 200) {
  return res.status(status).json({
    status: {
      code: status,
      message,
    },
    data,
    error: null,
  });
},

 async  errorResponse (res, message = "Internal Server Error", status = 500) {
  return res.status(status).json({
    status: {
      code: status,
      message,
    },
    data: {},
    error: message,
  });
},
};
