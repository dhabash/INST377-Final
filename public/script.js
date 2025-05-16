console.log("✅ script.js loaded");

const client = supabase.createClient(
  'https://tpzrjjybhkpfjjtczxyo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwenJqanliaGtwZmpqdGN6eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTA4NzEsImV4cCI6MjA2MjgyNjg3MX0.t30PhGq4lwiCF7OMgWNvJQ1IUphSVFqU3m2sXzCvMtw'
);

const gnewsKey = '64f296624fc5d8a33c99a52e01f0d195';

// ======= GLOBAL WEATHER & DATE (for all pages) =======
document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.getElementById('date');
  const weatherEl = document.getElementById('weather');

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

// ======= HOMEPAGE: Top Stories =======
document.addEventListener("DOMContentLoaded", () => {
  const topStoriesBox = document.getElementById('articles');
  if (!topStoriesBox) return;

  fetch(`https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=5&token=${gnewsKey}`)
    .then(res => res.json())
    .then(data => {
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
          const { error } = await client.from('saved_articles').insert([
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
});

// ======= PERSONALIZED FEED: Search =======
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const results = document.getElementById('searchResults');

  if (!searchInput || !searchBtn || !results) return;

  console.log("🔍 Search initialized");

  async function runSearch(query) {
    results.innerHTML = '<p>Loading...</p>';
    try {
      const response = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=6&sortby=relevance&token=${gnewsKey}`);
      const data = await response.json();

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
          const { error } = await client.from('saved_articles').insert([
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
    } catch (error) {
      console.error("❌ Error fetching search results:", error);
      results.innerHTML = '<p>Error fetching articles.</p>';
    }
  }

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      console.log("🔍 Running manual search:", query);
      runSearch(query);
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const prefilledTopic = urlParams.get('topic');
  if (prefilledTopic) {
    searchInput.value = prefilledTopic;
    console.log("🔍 Running prefilled search:", prefilledTopic);
    runSearch(prefilledTopic);
  }
});

// ======= SAVED ARTICLES PAGE =======
document.addEventListener("DOMContentLoaded", async () => {
  const savedArticlesBox = document.getElementById('saved-articles');
  if (!savedArticlesBox) return;

  const { data: articles, error } = await client
    .from('saved_articles')
    .select('*')
    .order('created_at', { ascending: false });

  savedArticlesBox.innerHTML = '';

  if (error) {
    savedArticlesBox.innerHTML = '<p>Error loading saved articles.</p>';
    console.error(error);
    return;
  }

  if (!articles || articles.length === 0) {
    savedArticlesBox.innerHTML = '<p>No saved articles found.</p>';
    return;
  }

  articles.forEach(article => {
    const articleEl = document.createElement('div');
    articleEl.className = 'article';
    articleEl.innerHTML = `
      <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
      <p>${article.source}</p>
      <button class="remove-btn">Remove</button>
    `;

    articleEl.querySelector('.remove-btn').addEventListener('click', async () => {
      const confirmDelete = confirm("Are you sure you want to remove this article?");
      if (!confirmDelete) return;

      const { error: deleteError } = await client
        .from('saved_articles')
        .delete()
        .eq('url', article.url);

      if (deleteError) {
        alert('Error deleting article.');
        console.error(deleteError);
      } else {
        articleEl.remove();
      }
    });

    savedArticlesBox.appendChild(articleEl);
  });
});
