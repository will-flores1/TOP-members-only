const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/AuthMiddleware.js");
const {
	GetPosts,
	CreatePost,
	GetPost,
	UpdatePost,
	DeletePost,
} = require("../controllers/PostController.js");

/*
 * @desc    Read all posts, create a new post
 * @route   GET, PUT, DELETE /api/users/
 * @access  Private
 */
router.route("/").get(protect, GetPosts).post(protect, CreatePost);

/*
 * @desc    Read post by ID, update post by ID, delete post by ID'
 * @route   GET, PUT, DELETE /api/users/:userId
 * @access  Private
 */
router
	.route("/:postId")
	.get(protect, GetPost)
	.put(protect, UpdatePost)
	.delete(protect, DeletePost);

module.exports = router;

/*
 * =====================================================
 * post.save(): saves a new post to the database.
 * Post.find(): retrieves all posts from the database.
 * Post.findById(): retrieves a specific post by its ID.
 * Post.updateOne(): updates a specific post by its ID.
 * Post.remove(): deletes a specific post by its ID.
 * =====================================================
 */
