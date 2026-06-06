const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/", requireAuth, bookingController.createBooking);
router.get("/", requireAdmin, bookingController.getAllBookings);
router.get("/user/:email", requireAuth, bookingController.getUserBookings);
router.patch("/:id/status", requireAdmin, bookingController.updateBookingStatus);
router.delete("/:id", requireAuth, bookingController.deleteBooking);

module.exports = router;
