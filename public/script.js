console.log("✅ script.js loaded");

const gnewsKey = '64f296624fc5d8a33c99a52e01f0d195'; 
const supabase = createClient('https://tpzrjjybhkpfjjtczxyo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenJqanliaGtwZmpqdGN6eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTA4NzEsImV4cCI6MjA2MjgyNjg3MX0.t30PhGq4lwiCF7OMgWNvJQ1IUphSVFqU3m2sXzCvMtw');

// ========== MAIN SCRIPT FOR ALL PAGES ========== //

// ======= HOMEPAGE: TOP STORIES, DATE, WEATHER =======
document.addEventListener("DOMContentLoaded", () => {
  const topStoriesBox = document.getElementById('articles');
  const dateEl = document.getElementById('date');
  const weatherEl = document.getElementById('weather');

  if (topStoriesBox) {
    fetch(`https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=5&token=${gnewsKey}`)
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
              alert("Saved (mock only — add backend to persist)");
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
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');

  function runSearch(query) {
    results.innerHTML = '<p>Loading...</p>';
    fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=6&sortby=relevance&token=${gnewsKey}`)
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
              alert("Saved (mock only — add backend to persist)");
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

      fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&max=10&sortby=publishedAt&token=${gnewsKey}`)
        .then(res => res.json())
        .then(data => {
          if (!data.articles || data.articles.length === 0) {
            compareResults.innerHTML = '<p>No articles found.</p>';
            return;
          }

          sources.forEach(source => {
            const filtered = data.articles.filter(a =>
              a.source.name.toLowerCase().includes(source.toLowerCase())
            );

            const container = document.createElement('div');
            container.className = 'article';
            const label = document.createElement('h4');
            label.textContent = source.replace(/-/g, ' ').toUpperCase();
            container.appendChild(label);

            if (filtered.length > 0) {
              const a = filtered[0];
              container.innerHTML += `
                <h3><a href="${a.url}" target="_blank">${a.title}</a></h3>
                <p>${a.source.name}</p>
                <button class="save-btn">Save Article</button>
              `;
              container.querySelector(".save-btn").addEventListener("click", () => {
                alert("Saved (mock only — add backend to persist)");
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
