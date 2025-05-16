export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=6&language=en&sortBy=publishedAt&apiKey=${apiKey}`
  );

  const data = await response.json();
  res.status(200).json(data);
}
