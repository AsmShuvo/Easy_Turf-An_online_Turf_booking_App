const express = require("express");
const router = express.Router();
const turfController = require("../controllers/turfController");

router.post("/", turfController.createTurf);
router.get("/", turfController.getAllTurfs);

module.exports = router;
