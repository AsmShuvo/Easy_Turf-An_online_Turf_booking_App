const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/", requireAdmin, userController.getAllUsers);
router.get("/:email", requireAuth, userController.getUser);

module.exports = router;
