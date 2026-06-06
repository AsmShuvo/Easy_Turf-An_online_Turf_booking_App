const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { signToken } = require("../middleware/auth");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;
const isHashed = (value) => typeof value === "string" && /^\$2[aby]\$/.test(value);

const sanitize = (user) => {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
};

const createUser = async (req, res) => {
  console.log("Received createUser request:", req.body);
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.upsert({
      where: { email },
      update: { name, password: hashed },
      create: { name, email, password: hashed },
    });

    const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role });
    res.status(200).json({ user: sanitize(newUser), token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let valid = false;
    if (isHashed(user.password)) {
      valid = await bcrypt.compare(password, user.password);
    } else if (user.password === password) {
      // Legacy plaintext row — migrate to a hash on successful login.
      valid = true;
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    }

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: sanitize(user), token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(sanitize(user));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users.map(sanitize));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = { createUser, loginUser, getUser, getAllUsers };
