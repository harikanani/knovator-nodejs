const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		created_by: {
			type: mongoose.Types.ObjectId,
			ref: "users",
			required: true,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		latitude: {
			type: String,
			required: true,
		},
		longitude: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		collection: "posts",
	},
);

const PostsModel = mongoose.model("posts", postSchema);

module.exports = PostsModel;
