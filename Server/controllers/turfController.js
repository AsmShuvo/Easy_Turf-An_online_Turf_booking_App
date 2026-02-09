const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createTurf = async (req, res) => {
  try {
    const { name, city, address, ownerId, ownerName, rent, image } = req.body;
    console.log(req.body);
    // Basic validation
    if (!name || !city || !rent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTurf = await prisma.turf.create({
      data: {
        name,
        city,
        address,
        ownerId,
        ownerName,
        rent: parseFloat(rent),
        image,
        slots: {},
      },
    });

    res.status(201).json({
      success: true,
      message: "Turf created successfully",
      data: newTurf,
    });
  } catch (error) {
    console.error("Error creating turf:", error);
    res.status(500).json({ error: "Failed to create turf" });
  }
};

const getAllTurfs = async (req, res) => {
  try {
    const turfs = await prisma.turf.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(turfs);
  } catch (error) {
    console.error("Error fetching turfs:", error);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
};

module.exports = { createTurf, getAllTurfs };
