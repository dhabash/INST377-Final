import express from 'express';
import dotenv from 'dotenv';
import saveHandler from './api/save.js';
import deleteHandler from './api/delete.js';
import savedHandler from './api/saved.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/save', saveHandler);
app.post('/api/delete', deleteHandler);
app.get('/api/saved', savedHandler);

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
