// ========== MAIN SCRIPT FOR ALL PAGES ========== //

// ======= HOMEPAGE: TOP STORIES, DATE, WEATHER =======
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = '0f3e8eedfec64cc9a19dd377b7e34462';
  const topStoriesBox = document.getElementById('articles');
  const dateEl = document.getElementById('date');
  const weatherEl = document.getElementById('weather');

  // Load top stories
  if (topStoriesBox) {
    fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.articles) {
          data.articles.forEach(article => {
            const articleEl = document.createElement('div');
            articleEl.className = 'article';
            articleEl.innerHTML = `
              <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
              <p>${article.source.name}</p>
              <button class="save-btn">Save Article</button>
            `;

            articleEl.querySelector(".save-btn").addEventListener("click", () => {
              fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: article.title,
                  source: article.source.name,
                  url: article.url
                })
              })
              .then(res => res.json())
              .then(() => alert("Article saved!"))
              .catch(() => alert("Error saving article."));
            });

            topStoriesBox.appendChild(articleEl);
            const line = document.createElement('hr');
            topStoriesBox.appendChild(line);
          });
        } else {
          topStoriesBox.innerHTML = '<p>No news available.</p>';
        }
      })
      .catch(err => {
        console.error('Error fetching news:', err);
        topStoriesBox.innerHTML = '<p>Error loading news.</p>';
      });
  }

  // Load current date
  if (dateEl) {
    const today = new Date();
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateEl.textContent = today.toLocaleDateString(undefined, dateOptions);
  }

  // Load weather
  if (weatherEl) {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=38.9&longitude=-77.03&current_weather=true")
      .then(response => response.json())
      .then(data => {
        const tempC = data.current_weather.temperature;
        const tempF = Math.round((tempC * 9/5) + 32);
        weatherEl.textContent = `Washington, DC: ${tempF}°F`;
      })
      .catch(() => {
        weatherEl.textContent = "Weather unavailable";
      });
  }
});
