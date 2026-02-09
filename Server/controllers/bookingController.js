const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createBooking = async (req, res) => {
  try {
    const { turfId, userEmail, date, slot, paymentMethod, transactionId } =
      req.body;

    // Validate inputs
    if (!turfId || !userEmail || !date || !slot || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Find User by Email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Please register first." });
    }

    // 2. Parse Slot (e.g., "12-13" -> { start: 12, end: 13 })
    const [start, end] = slot.split("-").map(Number);
    const newSlot = { start, end };

    // 3. Update Turf Slots & Create Booking in a Transaction
    // Note: Updating JSONB in Prisma can be tricky. We'll fetch, modify, and update.
    // A better approach for concurrency is pure SQL, but we'll stick to Prisma for now.

    // Fetch current turf slots
    const turf = await prisma.turf.findUnique({ where: { id: turfId } });
    if (!turf) {
      return res.status(404).json({ error: "Turf not found" });
    }

    const currentSlots = turf.slots || {};
    const daySlots = currentSlots[date] || [];

    // Check if already booked (Double check)
    const isBooked = daySlots.some((s) => s.start === start && s.end === end);
    if (isBooked) {
      return res.status(409).json({ error: "Slot already booked" });
    }

    // Append new slot
    daySlots.push(newSlot);
    const updatedSlots = { ...currentSlots, [date]: daySlots };

    const result = await prisma.$transaction([
      // Update Turf
      prisma.turf.update({
        where: { id: turfId },
        data: { slots: updatedSlots },
      }),
      // Create Booking
      prisma.booking.create({
        data: {
          userId: user.id,
          turfId: turf.id,
          date,
          slot,
          paymentMethod,
          transactionId,
          ownerId: turf.ownerId,
          ownerName: turf.ownerName,
          status: "PENDING",
        },
      }),
    ]);

    res.status(201).json({
      success: true,
      booking: result[1], // The booking object
      message: "Booking confirmed successfully!",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        turf: true, // Include turf details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

module.exports = { createBooking, getUserBookings };
