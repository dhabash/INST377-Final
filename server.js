// server.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const saveHandler = require('./api/save');
const deleteHandler = require('./api/delete');
const savedHandler = require('./api/saved');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // serve all static files like .html, .css, .js from root

// API Routes
app.post('/api/save', saveHandler);
app.post('/api/delete', deleteHandler);
app.get('/api/saved', savedHandler);

// Catch-all to serve homepage.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
