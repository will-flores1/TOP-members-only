const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/AuthMiddleware.js");
const UserCtlr = require("../controllers/UserController.js");

/*
 * @desc    Register get ALL user
 * @route   /api/users/

 */
router.get("/getUsers", protect, UserCtlr.GetUsers);

/*
 * @desc    Get logged in user
 * @route   /api/users/getMe
 */
//Delete this route for fun
router.get("/getMe", protect, UserCtlr.getMe);

/*
 * @desc    Read, Update, Delete user by ID
 * @route   /api/users/:userId
 */
router
	.route("/:userId")
	.get(protect, UserCtlr.GetUser)
	.put(protect, UserCtlr.UpdateUser)
	.delete(protect, UserCtlr.DeleteUser);

module.exports = router;
