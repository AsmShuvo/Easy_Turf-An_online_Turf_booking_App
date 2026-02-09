const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define routes
// Define routes
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getUser);

module.exports = router;
