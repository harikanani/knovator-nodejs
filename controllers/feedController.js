const mongoose = require("mongoose");
const PostsModel = require("../models/postsModel");
const { body, validationResult, sanitizeBody } = require("express-validator");

// fetch All Posts
exports.getAllPosts = [
	async (req, res) => {
		try {
			const posts = await PostsModel.find({
				is_active: true,
			}).populate("created_by", ["username", "email"]);
			if (!posts) {
				return res.status(404).json({
					message: `Not Posts Found.`,
					data: null,
				});
			}
			return res.status(200).json({
				message: `Posts Fetched Successfully!`,
				data: posts,
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];

// fetch Posts by latitude and longitude
exports.getPostsByLocation = [
	// body("latitude")
	// 	.isLength({ min: 1 })
	// 	.trim()
	// 	.withMessage("Latitude is required."),
	// body("longitude")
	// 	.isLength({ min: 1 })
	// 	.trim()
	// 	.withMessage("Longitude is required."),
	sanitizeBody("latitude").escape(),
	sanitizeBody("longitude").escape(),
	async (req, res) => {
		try {
			const { latitude, longitude } = req.body;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					message: "Validation Error!",
					error: errors.array(),
				});
			}

			if (!latitude && !longitude) {
				return res.status(400).json({
					message: "Validation Error!",
					error: "Latitude and Longitude are required.",
				});
			}

			const posts = await PostsModel.find({
				...(latitude && { latitude }),
				...(longitude && { longitude }),
				is_active: true,
			}).populate("created_by", ["username", "email"]);
			if (!posts) {
				return res.status(404).json({
					message: `Not Posts Found.`,
					data: null,
				});
			}
			return res.status(200).json({
				message: `Posts Fetched Successfully!`,
				data: posts,
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];

// Create Post
exports.createPost = [
	body("title").isLength({ min: 1 }).trim().withMessage("Title is required."),
	body("description")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Description is required."),
	body("latitude")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Latitude is required."),
	body("longitude")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Longitude is required."),
	sanitizeBody("title").escape(),
	sanitizeBody("description").escape(),
	sanitizeBody("latitude").escape(),
	sanitizeBody("longitude").escape(),
	async (req, res) => {
		try {
			const { title, description, latitude, longitude } = req.body;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					message: "Validation Error!",
					error: errors.array(),
				});
			}
			const post = await new PostsModel({
				title,
				description,
				created_by: req.user._id,
				latitude,
				longitude,
			}).save();

			return res.status(201).json({
				message: "Post Created Successfully!",
				data: post,
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];

// Edit Posts
exports.editPost = [
	body("title").isLength({ min: 1 }).trim().withMessage("Title is required."),
	body("description")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Description is required."),
	body("latitude")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Latitude is required."),
	body("longitude")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Longitude is required."),
	sanitizeBody("title").escape(),
	sanitizeBody("description").escape(),
	sanitizeBody("latitude").escape(),
	sanitizeBody("longitude").escape(),
	async (req, res) => {
		try {
			const { title, description, latitude, longitude } = req.body;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					message: "Validation Error!",
					error: errors.array(),
				});
			}

			const post = await PostsModel.findOneAndUpdate(
				{
					_id: req.params.id,
					created_by: mongoose.Types.ObjectId(req.user._id),
				},
				{ $set: { title, description, latitude, longitude } },
				{ new: true },
			);
			if (!post) {
				return res.status(400).json({
					message: `Something Went Wrong!`,
					data: null,
				});
			}
			return res.status(200).json({
				message: `Post Updated Successfully!`,
				data: post,
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];

exports.deletePost = [
	async (req, res) => {
		try {
			const post = await PostsModel.findOneAndDelete({
				_id: mongoose.Types.ObjectId(req.params.id),
				created_by: mongoose.Types.ObjectId(req.user._id),
			});
			if (!post) {
				return res.status(400).json({
					message: `Unauthorized or Post Not Found!`,
					data: null,
				});
			}
			return res.status(200).json({
				message: `Post Deleted Successfully!`,
				data: post,
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];
