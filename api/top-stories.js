export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`
  );

  const data = await response.json();
  res.status(200).json(data);
}
