const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/add-employee', async (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).send('Name and age are required!');
  }

  try {
    await pool.query('INSERT INTO employees (name, age) VALUES ($1, $2)', [name, age]);
    res.send(`<h3>Employee Added Successfully!</h3> <a href="/">Go Back</a>`);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Error adding employee.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
