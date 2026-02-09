const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings); // Admin route
router.get("/user/:email", bookingController.getUserBookings);
router.patch("/:id/status", bookingController.updateBookingStatus);
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
