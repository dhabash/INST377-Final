const apiKey = 'ApM8CCuiwD4RCSqaaTqxNdkBDdjUntrw'; 

// Fetch Reddit Trending Stocks
fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
  .then(res => res.json())
  .then(data => {
    const tableBody = document.querySelector('#redditTable tbody');
    const top5 = data.slice(0, 5);

    top5.forEach(stock => {
      const tr = document.createElement('tr');

      const tickerLink = document.createElement('a');
      tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
      tickerLink.target = '_blank';
      tickerLink.textContent = stock.ticker;

      const tdTicker = document.createElement('td');
      tdTicker.appendChild(tickerLink);

      const tdComments = document.createElement('td');
      tdComments.textContent = stock.no_of_comments;

      const tdSentiment = document.createElement('td');
      tdSentiment.innerHTML = stock.sentiment === "Bullish" ? '🐂' : '🐻';

      tr.appendChild(tdTicker);
      tr.appendChild(tdComments);
      tr.appendChild(tdSentiment);

      tableBody.appendChild(tr);
    });
  })
  .catch(err => console.error('Failed to fetch Reddit stocks:', err));

// Chart instance
let stockChart;

// Lookup Stock Function
async function lookupStock() {
  const ticker = document.getElementById('stockTicker').value.toUpperCase();
  const days = document.getElementById('dateRange').value;

  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days);

  const toDate = today.toISOString().split('T')[0];
  const fromDate = pastDate.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results) {
      alert('Stock data not available!');
      return;
    }

    const dates = data.results.map(d => new Date(d.t * 1000).toLocaleDateString());
    const closes = data.results.map(d => d.c);

    if (stockChart) {
      stockChart.destroy(); // Destroy old chart
    }

    const ctx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: `${ticker} Closing Price`,
          data: closes,
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    });

  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

// Button click
document.getElementById('lookupButton').addEventListener('click', lookupStock);

