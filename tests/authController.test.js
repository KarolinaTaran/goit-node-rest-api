import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { login } from "../controllers/authController.js";

jest.mock("../models/user.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Login Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it("should return status 200, a token, and a user object with email and subscription", async () => {
    const mockUser = {
      _id: "123456",
      email: "test@example.com",
      password: "hashedpassword",
      subscription: "starter",
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "mockToken",
      user: {
        email: mockUser.email,
        subscription: mockUser.subscription,
      },
    });
  });

  it("should return status 401 if email or password is wrong", async () => {
    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email or password is wrong",
    });
  });

  it("should return status 500 on internal server error", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
