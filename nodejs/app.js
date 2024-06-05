const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://chaiaurcode:chaiaurcode@localhost:5432/chaiDB',
});

// Middleware
app.use(bodyParser.json());

// Create users table if it doesn't exist
const createUsersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    client.release();
  }
};

// Call the function to create the table
createUsersTable();

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );
    res.status(201).json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});

app.get('/users', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
