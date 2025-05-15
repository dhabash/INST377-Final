import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing article URL' });

    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('url', url);

    if (error) throw error;

    res.status(200).json({ message: 'Article deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
}
