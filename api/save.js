import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, source, url } = req.body;

    const { data, error } = await supabase
      .from('saved_articles')
      .insert([{ title, source, url }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save article' });
    }

    return res.status(200).json({ message: 'Article saved successfully', data });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
