export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const { query, source } = req.query;

  if (!query || !source) {
    return res.status(400).json({ error: "Missing query or source parameter" });
  }

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sources=${source}&pageSize=1&sortBy=publishedAt&apiKey=${apiKey}`
  );

  const data = await response.json();
  res.status(200).json(data);
}
