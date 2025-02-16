// Load environment variables
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Ensure environment variables are loaded correctly
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_NAME) {
  console.error('❌ Missing required database environment variables');
  process.exit(1);
}

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Ensure port is set properly
  ssl: { rejectUnauthorized: false }, // Enable SSL for AWS RDS
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/add-employee', async (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).send('❌ Name and age are required!');
  }

  try {
    await pool.query('INSERT INTO employees (name, age) VALUES ($1, $2)', [name, age]);
    res.send(`<h3>✅ Employee Added Successfully!</h3> <a href="/">Go Back</a>`);
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).send('❌ Error adding employee.');
  }
});

// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to the database');
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
})();

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
