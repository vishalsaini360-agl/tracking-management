// const db = require("./../configs/db.config");

const logger = async (req) => {
  let isLoggable = false;
  let allowedPathPost = [
    "/api/flipkart/createCampaign",
    "/api/flipkart/updateCampaign",
    "/api/flipkart/dublicateCampaign",
    "/api/flipkart/removeKeyWord",
    "/api/flipkart/editSearchTerm",
    "/api/flipkart/tags",
    "/api/flipkart/saved_filter",
    "/api/flipkart/edit",
    "/api/flipkart/rules",
  ];

  let allowedPathPatch = [
    "/api/flipkart/tags",
    "/api/flipkart/tags/delete",
    "/api/flipkart/campaign/tag",
    "/api/flipkart/rules",
  ];

  if (allowedPathPost.includes(req.originalUrl) && req.method !== "GET") {
    isLoggable = true;
  }
  if (!isLoggable) {
    for (const item of allowedPathPatch) {
      if (req.originalUrl.includes(item) && req.method == "PATCH") {
        isLoggable = true;
        break;
      }
    }
  }
  if (isLoggable) {
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    // const result = await db[req.db].log.create({
    //   request_url: url,
    //   request_method: req.method,
    //   request_payload: req.body,
    //   response: {},
    //   user_details: req.user,
    //   error: "",
    // });
  }
};

module.exports = {
  logger,
};
