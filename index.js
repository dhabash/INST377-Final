const express = require('express');
const path = require('path');
const app = express();

// Serve static files (CSS, JS, etc.) from /public
app.use(express.static(path.join(__dirname, 'public')));

// Route to homepage.html in /public
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

// Other pages
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/compare', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'compare.html'));
});

app.get('/stocks', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stocks.html'));
});

app.get('/personalized', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'personalized.html'));
});

app.get('/saved_articles', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'saved_articles.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
