import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

import LoadingElement from "../components/LoadingElement";

export default function Header() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);

  const avatar = "http://localhost:5555/uploads/";

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      axios
        .get(`http://localhost:5555/tmdb/search/${query}`)
        .then((response) => {
          setResults(response.data.results.slice(0, 5));
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    setCursor(0);
  }, [results]);

  useEffect(() => {
    const scrollfollower = document.querySelector(".dropdown-item.active");
    scrollfollower?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "ArrowDown") {
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "Enter") {
      const item = results[cursor];
      if (item) {
        window.location.href = `/${item.media_type}/${item.id}`;
      }
    }
    if (e.keyCode === 9) e.preventDefault();
  };

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
          // tabIndex="-1"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        {user ? (
          <Link to={`/profile/${user.username}`}>
            {user.avatar ? (
              <img class="user-icon" src={`${avatar + user.avatar}`}></img>
            ) : (
              <img class="user-icon" src="/avatars/user.png"></img>
            )}
          </Link>
        ) : (
          <Link to="/login">
            <img class="user-icon" src="/avatars/user.png"></img>
          </Link>
        )}

        {results.length > -1 && (
          <ul className="dropdown-menu">
            {loading && (
              <li>
                <LoadingElement />
              </li>
            )}

            {!loading &&
              results.map((item, index) => (
                <li
                  key={item.id}
                  className={
                    cursor === index ? "dropdown-item active" : "dropdown-item"
                  }
                >
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
