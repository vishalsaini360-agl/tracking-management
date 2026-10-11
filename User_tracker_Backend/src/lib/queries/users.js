const mydb = require("./../../configs/mysql.config");
const { sequelize } = mydb;

const createQrCode = async (data) => {
  const qrCode = await mydb.ebux_screencode.create(data);
  return qrCode;
};

module.exports = {
  createQrCode,
};
