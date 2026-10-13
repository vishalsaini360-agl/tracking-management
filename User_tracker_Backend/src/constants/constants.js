const constants = {
  // URL: "http://localhost:3000",
  URL: "http://3.7.198.131:8080/",
  response_code: {
    /** Success Codes */
    SUCCESS: 200,
    No_Content: 204,
    EMPTY_REQ: 227,
    MAX_SUCCESS_CODE: 299,

    /** Other Codes*/
    RESOURCE_MOVED_PERMANENTLY: 301,

    /** Error Codes*/
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    JWT: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INVALID_ID: 406,
    DUPLICATE: 406,
    UPGRADE_APP: 426,
    ROLE_BREACH: 451,
    RECORD_NOT_FOUND: 499,
    INTERNAL_SERVER_ERROR: 500,
  },
 
};


module.exports = constants;
