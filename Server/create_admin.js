const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdmin() {
  const email = "admin123@gmail.com";
  const password = "admin123";
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password, role: "admin" },
      create: { name: "Admin", email, password, role: "admin" },
    });
    console.log(`Admin set: email=${user.email}, role=${user.role}`);
  } catch (error) {
    console.error("Failed to set admin:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
