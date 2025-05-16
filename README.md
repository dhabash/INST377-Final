# INST377-Final
# News Digest

News Digest is a web application designed to help users critically examine media coverage across different news outlets. By aggregating headlines and articles from various sources, users can compare coverage, search custom topics, and save articles for later. Built with HTML, CSS, and JavaScript, and powered by the GNews API and Supabase, the project enables thoughtful media consumption and offers a clean, user-friendly experience.

##  Target Browsers
- ✅ Chrome (latest versions)
- ✅ Firefox (latest versions)
- ✅ Safari (iOS 15+)
- ✅ Edge (latest versions)
- ✅ Mobile compatibility for Android and iOS Chrome/Safari

## Developer Manual

> _This section is for future developers working on this project._

###  Installation Instructions

1. **Clone the repository:**
```bash
git clone https://github.com/dhabash/INST377-Final.git
cd INST377-Final
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Variables:**
Create a `.env` file in the root directory:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GNEWS_KEY=your_gnews_api_key
```

###  Running the Application

To start a development server:
```bash
npm start
```
The app will be served on `http://localhost:3000` by default.

If using Vercel, all public files (HTML/CSS/JS) should be placed in the `/public` directory.


### 📡 API Endpoints 

| Endpoint           | Method | Description                                  |
|--------------------|--------|----------------------------------------------|
| `/api/top-stories`| GET    | Fetch top 5 U.S. headlines from GNews        |
| `/api/search`      | GET    | Query articles by keyword                    |
| `/api/save`        | POST   | Save an article to Supabase table            |
| `/api/saved`       | GET    | Fetch saved articles from Supabase           |
| `/api/delete`      | POST   | Delete an article from saved list            |

Supabase is used as the backend for storing user-saved articles. API keys must be securely stored using environment variables.

###  Known Bugs
- NewsAPI free-tier rate limits can affect availability (replaced with GNews).
- Article source filtering on Compare page is fuzzy and may mismatch at times.
-Initially there was a compare coverage page that let you compare coverage between News Sources on 1 topic. This was not avalaible with Gnews but I left the html and script in in case anyone ahd acess to News API.

### Roadmap
- Add user authentication with Supabase Auth.
- Support article tagging and filtering.
- Enable shareable links to saved feeds.
- Mobile-first redesign with better responsiveness.

###  File Structure
```
INST377-Final/
├── api/                     # API route handlers (if using Vercel functions)
├── public/                  # Static HTML, JS, CSS files
├── style.css                # Project stylesheet
├── script.js                # All JS functionality
├── stocks.js                # Chart/stock features
├── docs/                    # Markdown documentation folder
│   └── README.md            # This file
└── vercel.json              # Configuration file for deployment
```

---

