const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const createUser = async (req, res) => {
  console.log("Received createUser request:", req.body);
  const { name, email, password } = req.body; // Adjust fields as needed based on schema

  try {
    // Use upsert to handle cases where user might already exist (e.g. partial cleanup)
    const newUser = await prisma.user.upsert({
      where: { email },
      update: { name, password }, // Update name/password if exists
      create: {
        name,
        email,
        password, // Ideally hash this before storing
      },
    });
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = { createUser, getUser, getAllUsers };
