import { useEffect, useState } from "react";
import SkeletonCard from "./components/SkeletonCard";

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
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/news/football/?league=${league}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [league]);

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
              {article.image && <img src={article.image} alt="" />}
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
