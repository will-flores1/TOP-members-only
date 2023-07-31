const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const { GoogleAuthHandler } = require("../controllers/GoogleAuthController");
const validateGoogleAuthCode = require("../middleware/validateGoogleAuthCode");

/*
 * @desc    GET Google Authentication page
 * @route   /api/auth/
 * @access  Public
 */
// router.get("/", GetGoogleAuthAppURL);

/*
 * @desc		GET Google Authentication callback
 * @route   /api/auth/google/callback
 * @access  Public
 */
router.get("/google/callback", validateGoogleAuthCode, GoogleAuthHandler);

module.exports = router;
