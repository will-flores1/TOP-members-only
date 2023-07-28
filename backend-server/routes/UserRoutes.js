const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/AuthMiddleware.js");
const {
	RegisterUser,
	LoginUser,
	GetUsers,
	GetUser,
	UpdateUser,
	DeleteUser,
	getMe,
} = require("../controllers/UserController.js");

/*
 * @desc    Register new user user
 * @route   /api/users/register
 * @access  Public
 */
router.post("/register", RegisterUser);

/*
 * @desc    Login user
 * @route   /api/users/login
 * @access  Public
 */
router.post("/login", LoginUser);

/*
 * @desc    Register get ALL user
 * @route   /api/users/
 * @access  Public
 */
router.get("/", protect, GetUsers);

/*
 * @desc    Get logged in user
 * @route   /api/users/getMe
 * @access  Private
 * @note    This route is protected by the protect middleware
 * 				which verifies the JWT token in the request header.
 */
router.get("/getMe", protect, getMe);

/*
 * @desc    Update user by ID, Delete user by ID, Read user by ID
 * @route   /api/users/:userId
 * @access  Public
 */
router
	.route("/:userId")
	.get(protect, GetUser)
	.put(protect, UpdateUser)
	.delete(protect, DeleteUser);

module.exports = router;

/*
 * user.save(): saves a new user to the database.
 * User.find(): retrieves all users from the database.
 * User.findById(): retrieves a specific user by its ID.
 * User.updateOne(): updates a specific user by its ID.
 * User.remove(): deletes a specific user by its ID.
 */
