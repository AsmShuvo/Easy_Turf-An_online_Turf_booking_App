const express = require("express");
const router = express.Router();
const turfController = require("../controllers/turfController");
const { requireAdmin } = require("../middleware/auth");

router.post("/", requireAdmin, turfController.createTurf);
router.get("/", turfController.getAllTurfs);

module.exports = router;
