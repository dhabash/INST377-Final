// ========== MAIN SCRIPT FOR ALL PAGES ========== //

// ======= HOMEPAGE: TOP STORIES, DATE, WEATHER =======
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = '0f3e8eedfec64cc9a19dd377b7e34462';
  const topStoriesBox = document.getElementById('articles');
  const dateEl = document.getElementById('date');
  const weatherEl = document.getElementById('weather');

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
            topStoriesBox.appendChild(document.createElement('hr'));
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

  if (dateEl) {
    const today = new Date();
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateEl.textContent = today.toLocaleDateString(undefined, dateOptions);
  }

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

// ======= PERSONAL FEED PAGE =======
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = '0f3e8eedfec64cc9a19dd377b7e34462';
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');

  function runSearch(query) {
    results.innerHTML = '<p>Loading...</p>';
    fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=6&language=en&sortBy=publishedAt&apiKey=${apiKey}`)
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
              <button class="save-btn">Save Article</button>
            `;
            div.querySelector(".save-btn").addEventListener("click", () => {
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
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) runSearch(query);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const prefilledTopic = urlParams.get('topic');
  if (prefilledTopic && searchInput) {
    searchInput.value = prefilledTopic;
    runSearch(prefilledTopic);
  }
});

// ======= COMPARE COVERAGE PAGE =======
document.addEventListener("DOMContentLoaded", () => {
  const apiKey = '0f3e8eedfec64cc9a19dd377b7e34462';
  const compareInput = document.getElementById('compareInput');
  const compareBtn = document.getElementById('compareBtn');
  const compareResults = document.getElementById('compareResults');

  if (compareBtn && compareInput) {
    compareBtn.addEventListener('click', () => {
      const topic = compareInput.value.trim();
      const sources = Array.from(document.querySelectorAll('.source-options input:checked')).map(cb => cb.value);

      compareResults.innerHTML = '';

      if (!topic || sources.length === 0) {
        compareResults.innerHTML = '<p>Please enter a topic and select at least one source.</p>';
        return;
      }

      sources.forEach(source => {
        fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&sources=${source}&pageSize=1&sortBy=publishedAt&apiKey=${apiKey}`)
          .then(res => res.json())
          .then(data => {
            const container = document.createElement('div');
            container.className = 'article';
            const label = document.createElement('h4');
            label.textContent = source.replace(/-/g, ' ').toUpperCase();
            container.appendChild(label);

            if (data.articles && data.articles.length > 0) {
              const a = data.articles[0];
              container.innerHTML += `
                <h3><a href="${a.url}" target="_blank">${a.title}</a></h3>
                <p>${a.source.name}</p>
                <button class="save-btn">Save Article</button>
              `;
              container.querySelector(".save-btn").addEventListener("click", () => {
                fetch('/api/save', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: a.title,
                    source: a.source.name,
                    url: a.url
                  })
                })
                .then(res => res.json())
                .then(() => alert("Article saved!"))
                .catch(() => alert("Error saving article."));
              });
            } else {
              container.innerHTML += `<p>No articles found from this source.</p>`;
            }

            compareResults.appendChild(container);
          });
      });
    });
  }
});

