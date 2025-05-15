import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, url, source } = req.body;
    const { data, error } = await supabase
      .from('saved_articles')
      .insert([{ title, url, source }]);

    if (error) throw error;

    res.status(200).json({ message: 'Article saved successfully' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save article' });
  }
}
