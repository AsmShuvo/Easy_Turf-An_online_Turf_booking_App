const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function promoteToAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: "admin" },
    });
    console.log(`✅ User ${user.email} promoted to ADMIN.`);
  } catch (error) {
    console.error("❌ Failed to promote user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Replace with the email you want to make admin
const targetEmail = process.argv[2];

if (!targetEmail) {
  console.log("Usage: node set_admin.js <email>");
} else {
  promoteToAdmin(targetEmail);
}
