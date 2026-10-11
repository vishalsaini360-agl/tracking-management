const { QRCodeGen } = require("./utils");
const { createQrCode } = require("./queries/users");
const mydb = require("./../configs/mysql.config");
const { sequelize } = mydb;

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.info(`User connected ${socket.id}`);
    socket.on("newQR", async function () {
      let code = QRCodeGen(10);
      let payload = {
        screencode: code,
        user_id: "",
        password: "",
        status: 1,
        is_used: 0,
      };
      // await createQrCode(payload);
      socket.qr = code;
      socket.emit("getQR", { code });
    });
  });
};
