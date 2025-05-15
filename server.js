import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env variables
dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (CSS, JS, etc.)

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});

// ========== API ROUTES ========== //

// Save article
app.post('/api/save', async (req, res) => {
  const { title, source, url } = req.body;

  try {
    const { data, error } = await supabase
      .from('saved_articles')
      .insert([{ title, source, url }]);

    if (error) throw error;
    res.status(200).json({ message: 'Saved successfully', data });
  } catch (err) {
    console.error('Error saving article:', err.message);
    res.status(500).json({ error: 'Failed to save article' });
  }
});

// Get saved articles
app.get('/api/saved', async (req, res) => {
  try {
    const { data, error } = await supabase.from('saved_articles').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load saved articles' });
  }
});

// Delete article
app.post('/api/delete', async (req, res) => {
  const { url } = req.body;

  try {
    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('url', url);

    if (error) throw error;
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting article:', err.message);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
