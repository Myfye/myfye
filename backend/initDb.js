const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function initializeDatabase() {
  try {
    // Read the schema file
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

    // Execute the schema
    await pool.query(schema);
    console.log("Database schema created successfully");

    // Close the pool
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
