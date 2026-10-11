const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3Config} = require("../configs/config");
const BucketName = process.env.BUCKET_NAME;
  const upload = multer({
    storage: multerS3({
      s3: s3Config,
      bucket: BucketName,
      metadata: function (req, file, cb) {

        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const fileString = `${Date.now()}_${file.originalname}`;

        cb(null, fileString);
      },
    }),
  });

  const FileMiddleware = [
    upload.fields([
      {
        name: 'url',
        maxCount: 1,
      },
    ]),
  ];
  module.exports = {
    FileMiddleware
  };
  