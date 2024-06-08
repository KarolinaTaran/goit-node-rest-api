import multer from "multer";
import {
  register,
  login,
  logout,
  currentUser,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController.js";
import auth from "../middlewares/auth.js";

import express from "express";

var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, currentUser);
const upload = multer({ dest: "public/avatars" });

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
router.get("/verify/:verificationToken", auth, verifyEmail);
router.post("/verify", auth, resendVerificationEmail);

export default router;
