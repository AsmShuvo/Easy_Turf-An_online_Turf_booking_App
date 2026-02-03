// server.js
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { query } = require("./db/db"); // Import the query function from db.js
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Example endpoint that queries the database
app.get("/users", async (req, res) => {
  try {
    const result = await query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying the database");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
