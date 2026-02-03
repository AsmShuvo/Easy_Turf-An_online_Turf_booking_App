console.log("Checking modules...");
try {
  require("express");
  console.log("express ok");
} catch (e) {
  console.log("express fail", e.message);
}
try {
  require("dotenv");
  console.log("dotenv ok");
} catch (e) {
  console.log("dotenv fail", e.message);
}
try {
  require("pg");
  console.log("pg ok");
} catch (e) {
  console.log("pg fail", e.message);
}
try {
  require("cors");
  console.log("cors ok");
} catch (e) {
  console.log("cors fail", e.message);
}
try {
  require("@prisma/client");
  console.log("@prisma/client ok");
} catch (e) {
  console.log("@prisma/client fail", e.message);
}
try {
  require("./db");
  console.log("./db ok");
} catch (e) {
  console.log("./db fail", e.message);
}
try {
  require("./routes/userRoutes");
  console.log("./routes/userRoutes ok");
} catch (e) {
  console.log("./routes/userRoutes fail", e.message);
}
