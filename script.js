document.addEventListener("DOMContentLoaded", () => {
  const apiKey = '0f3e8eedfec64cc9a19dd377b7e34462'; // replace with your real key
  const topStoriesBox = document.getElementById('articles');

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
          `;
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

  // Load current date
  const dateEl = document.getElementById('date');
  const today = new Date();
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  dateEl.textContent = today.toLocaleDateString(undefined, dateOptions);

  // Load weather (Washington, DC)
  const weatherEl = document.getElementById('weather');

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
});





document.addEventListener("DOMContentLoaded", () => {
  const apiKey = '0f3e8eedfec64cc9a19dd377b7e34462';
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');

  // Date
  const dateEl = document.getElementById('date');
  const today = new Date();
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  dateEl.textContent = today.toLocaleDateString(undefined, dateOptions);

  // Weather
  const weatherEl = document.getElementById('weather');
  fetch("https://api.open-meteo.com/v1/forecast?latitude=38.9&longitude=-77.03&current_weather=true")
    .then(response => response.json())
    .then(data => {
      const tempF = Math.round((data.current_weather.temperature * 9/5) + 32);
      weatherEl.textContent = `Washington, DC: ${tempF}°F`;
    });

  // Search function
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;

    results.innerHTML = '<p>Loading...</p>';

    fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=6&sortBy=publishedAt&apiKey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          results.innerHTML = '';
          data.articles.forEach(article => {
            const div = document.createElement('div');
            div.className = 'article';
            div.innerHTML = `
              <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
              <p>${article.source.name}</p>
            `;
            results.appendChild(div);
            results.appendChild(document.createElement('hr'));
          });
        } else {
          results.innerHTML = '<p>No articles found.</p>';
        }
      })
      .catch(() => {
        results.innerHTML = '<p>Error fetching articles.</p>';
      });
  });
});
