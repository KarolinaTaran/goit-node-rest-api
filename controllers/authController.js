import Joi from "joi";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import gravatar from "gravatar";
import jimp from "jimp";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: `Registration validation error: ${error.details[0].message}`,
      });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, avatarURL });
    await user.save();

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: `Login validation error: ${error.details[0].message}`,
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();
    // res.send({ token });
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `${uuidv4()}_${req.file.originalname}`;

    const tmpFilePath = req.file.path;

    const targetFilePath = path.join("public", "avatars", fileName);

    await jimp
      .read(tmpFilePath)
      .then((image) => image.resize(250, 250).write(targetFilePath));

    fs.unlinkSync(tmpFilePath);

    const fileUrl = path.join("/avatars", req.file.fileName);
    user.avatarURL = fileUrl;
    await user.save();

    res.status(200).json({ avatarURL: fileUrl });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
