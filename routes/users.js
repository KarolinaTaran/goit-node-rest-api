import {
  register,
  login,
  logout,
  currentUser,
} from "../controllers/authController.js";
import auth from "../middlewares/auth.js";

import express from "express";

var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, currentUser);

export default router;
