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
      });
    } else {
      topStoriesBox.innerHTML = '<p>No news available.</p>';
    }
  })
  .catch(err => {
    console.error('Error fetching news:', err);
    topStoriesBox.innerHTML = '<p>Error loading news.</p>';
  });

const line = document.createElement('hr');
topStoriesBox.appendChild(articleEl);
topStoriesBox.appendChild(line);