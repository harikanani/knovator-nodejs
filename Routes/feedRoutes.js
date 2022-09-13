const express = require("express");
const passport = require("passport");
const feedController = require("../controllers/feedController");

const feedRouter = express.Router();

// Get All Posts
feedRouter.get(
	"/posts",
	passport.authenticate("jwt", { session: false }),
	feedController.getAllPosts,
);

// get post by geolocation
feedRouter.post(
	"/posts/geolocation",
	passport.authenticate("jwt", { session: false }),
	feedController.getPostsByLocation,
);

// Create Post
feedRouter.post(
	"/post",
	passport.authenticate("jwt", { session: false }),
	feedController.createPost,
);

// Edit Post
feedRouter.put(
	"/post/:id",
	passport.authenticate("jwt", { session: false }),
	feedController.editPost,
);

// Delete Post
feedRouter.delete(
	"/post/:id",
	passport.authenticate("jwt", { session: false }),
	feedController.deletePost,
);

module.exports = feedRouter;
