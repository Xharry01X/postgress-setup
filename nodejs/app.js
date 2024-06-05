// src/index.js
const express = require('express');
const createUsersTable = require("./models/userSchema");

const app = express();
const PORT = process.env.PORT || 3000;

// Create users table if not exists
createUsersTable()
  .then(() => {
    // Start the server only after the table is created
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });

// Define routes, middleware, etc. below
