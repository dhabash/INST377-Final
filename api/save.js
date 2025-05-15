import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { title, source, url } = req.body

  const { error } = await supabase.from('articles').insert([{ title, source, url }])

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error saving article' })
  }

  return res.status(200).json({ message: 'Article saved' })
}
