import { useEffect, useState } from "react";
import SkeletonCard from "./components/SkeletonCard";
import placeholder from "./assets/placeholder.png"

const LEAGUES = {
  epl: "Premier League",
  ucl: "Champions League",
  laliga: "La Liga",
  seriea: "Serie A",
};

function App() {
  const [league, setLeague] = useState("epl"); //set state for default league
  const [articles, setArticles] = useState([]); //set state for default article
  const [loading, setLoading] = useState(false); //set state to handle loading and reloading
  const [menuOpen, setMenuOpen] = useState(false); //set state for toggling the hamburger menu icon
  const [error, setError] = useState(false); //set use state for error handling

  // At the top
  const [theme, setTheme] = useState(() => {
    // Lazy initialization from localStorage
    return localStorage.getItem("theme") || "light";
  });

  // Sync theme to localStorage AND document attribute
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch articles when league changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/news/football/?league=${league}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }

        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError("Unable to load news. Try again later.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [league]);
  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <div className="state error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="state empty">
        <p>No football news available for this league.</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Dark mode toggle */}
      <header className="header">
        <h1>Hume Sports</h1>

        <div className="header-actions">
          {/* Desktop tabs */}
          <div className="tabs desktop-tabs">
            {Object.entries(LEAGUES).map(([key, label]) => (
              <button
                key={key}
                className={league === key ? "active" : ""}
                onClick={() => setLeague(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Hamburger (mobile only) */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="mobile-menu">
          {Object.entries(LEAGUES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setLeague(key);
                setMenuOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <h1>{LEAGUES[league]} News</h1>

      {/* Grid */}
      <div className="grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

        {!loading &&
          articles.map((article, index) => (
            <div className="card" key={index}>
              {article.image && (
                <img
                  src={article.image}
                  loading="lazy"
                  onError={(e) => (e.target.src = { placeholder })}
                  alt="article mage"
                />
              )}
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <small>{article.source}</small>
              <br />
              <a href={article.url} target="_blank" rel="noreferrer">
                Read more
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
