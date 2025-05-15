import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing article URL' });
  }

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('url', url);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error deleting article' });
  }

  return res.status(200).json({ message: 'Article deleted' });
}
