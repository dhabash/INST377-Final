console.log("✅ script.js loaded");

// Supabase setup
const supabase = supabase.createClient(
  'https://tpzrjjybhkpfjjtczxyo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenJqanliaGtwZmpqdGN6eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTA4NzEsImV4cCI6MjA2MjgyNjg3MX0.t30PhGq4lwiCF7OMgWNvJQ1IUphSVFqU3m2sXzCvMtw'
);

const gnewsKey = '64f296624fc5d8a33c99a52e01f0d195';

// ======= HOMEPAGE =======
document.addEventListener("DOMContentLoaded", () => {
  const topStoriesBox = document.getElementById('articles');
  const dateEl = document.getElementById('date');
  const weatherEl = document.getElementById('weather');

  if (topStoriesBox) {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=5&token=${gnewsKey}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("📰 GNews response:", data);
        if (!data.articles || data.articles.length === 0) {
          topStoriesBox.innerHTML = '<p>No articles found.</p>';
          return;
        }

        topStoriesBox.innerHTML = '';
        data.articles.forEach(article => {
          const articleEl = document.createElement('div');
          articleEl.className = 'article';
          articleEl.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.source.name}</p>
            <button class="save-btn">Save Article</button>
          `;
          articleEl.querySelector(".save-btn").addEventListener("click", async () => {
            const { error } = await supabase.from('saved_articles').insert([
              {
                title: article.title,
                source: article.source.name,
                url: article.url
              }
            ]);
            if (error) {
              console.error("❌ Error saving article:", error);
              alert("Error saving article.");
            } else {
              alert("Article saved!");
            }
          });
          topStoriesBox.appendChild(articleEl);
        });
      })
      .catch(err => {
        console.error('❌ Error fetching news:', err);
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
      .then(res => res.json())
      .then(data => {
        const tempF = Math.round((data.current_weather.temperature * 9 / 5) + 32);
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
        if (!data.articles || data.articles.length === 0) {
          results.innerHTML = '<p>No articles found.</p>';
          return;
        }
        results.innerHTML = '';
        data.articles.forEach(article => {
          const div = document.createElement('div');
          div.className = 'article';
          div.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.source.name}</p>
            <button class="save-btn">Save Article</button>
          `;
          div.querySelector(".save-btn").addEventListener("click", async () => {
            const { error } = await supabase.from('saved_articles').insert([
              {
                title: article.title,
                source: article.source.name,
                url: article.url
              }
            ]);
            if (error) {
              console.error("❌ Error saving article:", error);
              alert("Error saving article.");
            } else {
              alert("Article saved!");
            }
          });
          results.appendChild(div);
        });
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
              a.source.name.toLowerCase().includes(source.toLowerCase()) ||
              source.toLowerCase().includes(a.source.name.toLowerCase())
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
              container.querySelector(".save-btn").addEventListener("click", async () => {
                const { error } = await supabase.from('saved_articles').insert([
                  {
                    title: a.title,
                    source: a.source.name,
                    url: a.url
                  }
                ]);
                if (error) {
                  alert("Error saving article.");
                } else {
                  alert("Article saved!");
                }
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
