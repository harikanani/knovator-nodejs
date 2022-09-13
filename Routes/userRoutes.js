const express = require("express");
const passport = require("passport");

const UserController = require("../controllers/userController");

const userRouter = express.Router();

// Get User Profile
userRouter.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	UserController.getDashboard,
);

module.exports = userRouter;
