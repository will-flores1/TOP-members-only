const express = require("express");
const router = express.Router();
const {
	protect,
	registerValidation,
	loginValidation,
	googleAuthCodeValidation,
} = require("../middleware/AuthMiddleware.js");
const {
	RegisterUser,
	LoginUser,
	GoogleSignInHandler,
	LogoutUser,
	GetUsers,
	GetUser,
	UpdateUser,
	DeleteUser,
	getMe,
} = require("../controllers/UserController.js");

/*
 * @desc    Register new user user
 * @route   /api/users/register
 */
router.post("/register", registerValidation, RegisterUser);

/*
 * @desc    User sign in
 * @route   /api/users/login
 */
router.post("/login", loginValidation, LoginUser);

/*
 * @desc		Google sign in callback
 * @route   /api/users/google/callback
 */
router.get("/google/callback", googleAuthCodeValidation, GoogleSignInHandler);

/*
 * @desc    Login user
 * @route   /api/users/logout
 */
router.post("/logout", protect, LogoutUser);

/*
 * @desc    Register get ALL user
 * @route   /api/users/

 */
router.get("/getUsers", protect, GetUsers);

/*
 * @desc    Get logged in user
 * @route   /api/users/getMe
 */
//Delete this route for fun
router.get("/getMe", protect, getMe);

/*
 * @desc    Update user by ID, Delete user by ID, Read user by ID
 * @route   /api/users/:userId
 */
router
	.route("/:userId")
	.get(protect, GetUser)
	.put(protect, UpdateUser)
	.delete(protect, DeleteUser);

module.exports = router;
