// models/userSchema.js
const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://chaiaurcode:chaiaurcode@localhost:5432/chaiDB',
});

// Create users table if not exists
const createUsersTable = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    client.release();
    console.log('Users table created successfully');
  } catch (error) {
    throw new Error(`Error creating users table: ${error}`);
  }
};

module.exports = createUsersTable;
