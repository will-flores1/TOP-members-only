const asyncHandler = require("express-async-handler");
const Post = require("../models/PostSchema.js");

const PostCtlr = (() => {
	const GetPosts = asyncHandler(async (req, res) => {
		const { user } = req;

		const posts = await Post.find({ userID: user.id });
		if (posts) {
			res.status(200).json(posts);
		} else {
			res.status(500);
			throw new Error("An error occurred while retrieving posts");
		}
	});

	const CreatePost = asyncHandler(async (req, res) => {
		const { user } = req;
		const { title, body } = req.body;

		if (!body) {
			res.status(400);
			throw new Error("Please add a body");
		}

		const post = await Post.create({
			title: title,
			body: body,
			userID: user.id,
			author: user.username,
		});

		res.json(post);
	});

	const GetPost = asyncHandler(async (req, res) => {
		const post = await Post.findOne({ _id: req.params.postId });

		if (post.userID.toString() !== req.user.id) {
			res.status(401);
			throw new Error("You are not authorized to view this post");
		}

		if (post) {
			res.json(post);
		} else {
			res.send(404).json("Post not found");
		}
	});

	const UpdatePost = asyncHandler(async (req, res) => {
		const { postId } = req.params;
		const { user } = req;

		const post = await Post.findById(postId);

		if (!post) {
			res.status(400);
			throw new Error("Post not found");
		}

		if (!user) {
			res.status(401);
			throw new Error("User not authorized");
		}

		if (post.userID.toString() !== user._id.toString()) {
			res.status(401);
			throw new Error("You are not authorized to update this post");
		}

		let update = {};
		if (req.body.title) {
			update.title = req.body.title;
		}
		if (req.body.body) {
			update.body = req.body.body;
		}
		if (req.body.userID) {
			update.userID = req.body.userID;
		}

		try {
			const updatedPost = await Post.updateOne(
				{ _id: postId },
				{ $set: update }
			);
			const post = await Post.findById(postId);
			res.json(post);
		} catch (err) {
			res.status(400);
			throw new Error("Invalid post data");
		}
	});

	const DeletePost = asyncHandler(async (req, res) => {
		const { user } = req;
		const { postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			res.status(400);
			res.json("Post not found");
		}

		if (!user) {
			res.status(401);
			throw new Error("User not found");
		}

		if (post.userID.toString() !== user._id.toString()) {
			res.status(401);
			throw new Error("You are not authorized to update this post");
		}

		try {
			const removedPost = await Post.findByIdAndRemove(postId);
			res.json(removedPost);
		} catch (err) {
			res.status(400);
			throw new Error("Invalid post ID");
		}
	});

	return {
		GetPosts,
		CreatePost,
		GetPost,
		UpdatePost,
		DeletePost,
	};
})();

module.exports = PostCtlr;
