const express = require("express");
const router = express.Router();
const authCtrl = require("./../controllers/AuthController");
const { authorize, authorizeNewBeforLogin } = require("./../middlewares/auth");

// Internal login routes
router.post("/auth/internal-login", authorizeNewBeforLogin, authCtrl.internalLogin);
router.post("/internal-login", authorizeNewBeforLogin, authCtrl.internalLogin);

// Logout routes
router.post("/auth/logout", authCtrl.logout);
router.post("/logout", authCtrl.logout);
router.post("/auth/self-logout", authorize, authCtrl.logoutForEgine);
router.post("/self-logout", authorize, authCtrl.logoutForEgine);

module.exports = router;
