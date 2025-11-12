import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 2) {
        fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=fi-FI&query=${encodeURIComponent(
            query
          )}`
        )
          .then((res) => res.json())
          .then((data) => setResults(data.results || []))
          .catch((err) => console.error(err));
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, apiKey]);

  return (
    <header>
      <div>
        <Link to="/">
          <img src="./5moviestransparent.png" className="logo" alt="logo"></img>
        </Link>
        <nav className="nav-items">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/series">Series</Link>
          <Link to="/groups">Groups</Link>
        </nav>
      </div>
      <div class="search-box">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 rounded text-black w-64"
        ></input>
        <Link to="/login">
          <img class="user-icon" src="./user.png"></img>
        </Link>

        {results.length > 0 && (
          <ul className="absolute right-0 top-12 bg-white text-black w-64 max-h-96 overflow-y-auto rounded shadow-lg z-50">
            {results.map((item) => (
              <li
                key={item.id}
                className="p-2 border-b hover:bg-gray-200 flex items-center gap-3"
              >
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={item.title || item.name}
                  />
                ) : (
                  <div
                    style={{
                      width: "32px",
                      height: "48px",
                      backgroundColor: "#ccc",
                      borderRadius: "4px",
                    }}
                  />
                )}
                <span>{item.title || item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
