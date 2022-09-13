const PostsModel = require("../models/postsModel");
const UsersModel = require("../models/usersModel");

// Get Dashboard - Get Counts of Total Active and Inactive Posts
// Get Profile and Dashboard
exports.getDashboard = [
	async (req, res) => {
		try {
			const inactivePosts = await PostsModel.find({
				is_active: false,
				created_by: req.user._id,
			});

			const activePosts = await PostsModel.find({
				is_active: true,
				created_by: req.user._id,
			});

			const usersPosts = await PostsModel.find({
				is_active: true,
				created_by: req.user._id,
			}).populate("created_by", ["username", "email"]);

			const user = await UsersModel.findById(req.user._id).select(
				"-password",
			);

			return res.status(200).json({
				message: `Dashboard Fetched Successfully!`,
				data: {
					usersPosts,
					inactivePosts: inactivePosts.length,
					activePosts: activePosts.length,
					user,
				},
			});
		} catch (error) {
			return res.status(500).json({
				message: "Internal Server Error!",
				error: error.message,
			});
		}
	},
];
