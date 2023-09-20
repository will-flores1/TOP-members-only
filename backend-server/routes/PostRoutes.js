const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/AuthMiddleware.js");
const PostCtlr = require("../controllers/PostController.js");

/*
 * @desc    Read all posts, create a new post
 * @route   GET, PUT, DELETE /api/users/
 * @access  Private
 */
router
	.route("/")
	.get(protect, PostCtlr.GetPosts)
	.post(protect, PostCtlr.CreatePost);

/*
 * @desc    Read post by ID, update post by ID, delete post by ID'
 * @route   GET, PUT, DELETE /api/users/:userId
 * @access  Private
 */
router
	.route("/:postId")
	.get(protect, PostCtlr.GetPost)
	.put(protect, PostCtlr.UpdatePost)
	.delete(protect, PostCtlr.DeletePost);

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
