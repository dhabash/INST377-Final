const express = require('express');
const path = require('path');
const app = express();

// Serve all static files (CSS, JS, images, etc.) from public/
app.use(express.static(path.join(__dirname, 'public')));

// Routes to HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
