const UsersModel = require("../models/usersModel");
const { body, validationResult, sanitizeBody } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Register Controller
exports.register = [
	// username Validation
	body("username")
		.isLength({ min: 1 })
		.trim()
		.withMessage("username must be specified."),

	// Email Validation
	body("email")
		.isLength({ min: 5 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address.")
		.custom((value) => {
			return UsersModel.findOne({ email: value }).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),

	// Password Validation
	body("password")
		.isLength({ min: 6 })
		.trim()
		.withMessage("Password must be 6 characters or greater."),

	// Sanitize fields.
	sanitizeBody("username").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	async (req, res) => {
		try {
			const { username, email, password } = req.body;

			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return res.status(400).json({
					message: "Validation Error!",
					error: errors.array(),
				});
			}

			// Save User to database
			const user = await new UsersModel({
				username,
				email,
				password,
			}).save();

			// check if user saved or not?
			if (!user) {
				return res.status(400).json({
					message: `Something Went Wrong! Please Try Again.`,
				});
			}

			// return success message
			return res.status(200).json({
				message: `User Registered Successfully!`,
				data: user,
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];

exports.login = [
	// Email Validation
	body("email")
		.isLength({ min: 5 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address.")
		.custom((value) => {
			return UsersModel.findOne({ email: value }).then((user) => {
				if (!user) {
					return Promise.reject(
						"User not found with that email address.",
					);
				}
			});
		}),
	// Password Validation
	body("password")
		.isLength({ min: 6 })
		.trim()
		.withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),

	// passport authentication
	// passport.authenticate("jwt", { session: false }),

	// login controller
	async (req, res) => {
		try {
			const { email, password } = req.body;

			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return res.status(400).json({
					message: "Validation Error!",
					error: errors.array(),
				});
			}

			// check if user exists
			const user = await UsersModel.findOne({ email });
			if (!user) {
				return res.status(400).json({
					message: `User not found with that email address.`,
				});
			}

			// check if password is correct
			if (!(await bcrypt.compare(password, user.password))) {
				return res.status(400).json({
					message: `Incorrect password.`,
				});
			}

			// Sign JWT Token
			const token = await jwt.sign(
				{ _id: user._id, email: user.email, username: user.username },
				process.env.JWT_SECRET,
				{ expiresIn: process.env.JWT_EXPIRES_IN },
			);

			// return success message
			return res.status(200).json({
				message: `User Logged In Successfully!`,
				data: { user, token },
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];
