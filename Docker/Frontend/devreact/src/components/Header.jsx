import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 2) {
        axios
          .get(
            "https://api.themoviedb.org/3/search/multi?include_adult=false",
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              },

              params: {
                query: query,
                language: "en-US",
                page: 1,
              },
            }
          )
          .then((response) => {
            setResults(response.data.results.slice(0, 5));
          })
          .catch((error) => {
            console.error("Error fetching search results:", error);
            setResults([]);
          });
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, apiKey]);

  return (
    <header>
      <div>
        <Link to="/">
          <img src="/5moviestransparent.png" className="logo" alt="logo"></img>
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
        ></input>
        <Link to="/login">
          <img class="user-icon" src="/avatars/user.png"></img>
        </Link>

        {results.length > 0 && (
          <ul className="dropdown-menu">
            {results.map((item) => (
              <li key={item.id} className="dropdown-item">
                <Link
                  to={`/${item.media_type}/${item.id}`}
                  reloadDocument={true}
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                    />
                  ) : (
                    <div
                      style={{
                        width: "40px",
                        height: "80px",
                        backgroundColor: "#00000000",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <span>{item.title || item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
