const express = require("express");
const router = express.Router();
const {
	protect,
	registerValidation,
	loginValidation,
	googleAuthCodeValidation,
} = require("../middleware/AuthMiddleware.js");
const AuthCtlr = require("../controllers/AuthController.js");

/*
 * @desc    Register new user user
 * @route   /api/auth/register
 */
router.post("/register", registerValidation, AuthCtlr.register);

/*
 * @desc    User sign in
 * @route   /api/auth/login
 */
router.post("/login", loginValidation, AuthCtlr.login);

/*
 * @desc		Google sign in callback
 * @route   /api/auth/google/callback
 */
router.get(
	"/google/callback",
	googleAuthCodeValidation,
	AuthCtlr.googleSignInHandler
);

/*
 * @desc    Login user
 * @route   /api/auth/logout
 */
router.post("/logout", protect, AuthCtlr.logout);

module.exports = router;
