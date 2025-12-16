import { useState, useEffect, useContext, useRef } from "react";
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
  //tässäki testaan sitä hakukentän settiä
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  //tähä asti
  const url = import.meta.env.VITE_IP;
  const avatar = url + "/uploads/";

  const searchBoxRef = useRef(null);

  /*useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      axios
        .get(`${url}/tmdb/search/${query}`)
        .then((response) => {
          setResults(
            response.data.results.filter(
              (result) =>
                result.media_type !== "person" && result.poster_path !== null
            )
          );
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
  vanha use effect jos tuo mun uus ei kelepaa:) */

  //tässä lisää eeron hakukenttä sekoilua
  useEffect(() => {
    //setResults([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [query]);
  //tässä loppuu

  useEffect(() => {
    if (query.length === 0) {
      setLoading(false);
      setResults([]);

      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      axios
        .get(`${url}/tmdb/search/${query}?page=${page}`)
        .then((response) => {
          const filtered = response.data.results.filter(
            (r) => r.media_type !== "person" && r.poster_path
          );

          setResults((prev) =>
            page === 1 ? filtered : [...prev, ...filtered]
          );

          if (page >= response.data.total_pages) {
            setHasMore(false);
          }
        })
        .catch(() => setHasMore(false))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, page]);

  useEffect(() => {
    setCursor(0);
  }, [results]);

  useEffect(() => {
    const scrollfollower = document.querySelector(".dropdown-item.active");
    scrollfollower?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  //tää on tolle et se tyhjentää haun jos painaa jostain muualta:)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //loppuu tähä :)

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
          <Link className="mobile-hide" to="/">
            Home
          </Link>
          <Link className="mobile-hide" to="/movies">
            Movies
          </Link>
          <Link className="mobile-hide" to="/series">
            Series
          </Link>
          <Link to="/groups">Groups</Link>
        </nav>
      </div>
      <div className="search-box" ref={searchBoxRef}>
        <input
          //tabIndex="-1"
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        {user ? (
          <Link to={`/profile/${user.username}`}>
            {user.avatar ? (
              <img
                className="user-icon"
                loading="lazy"
                src={`${avatar + user.avatar}`}
              ></img>
            ) : (
              <img
                className="user-icon"
                loading="lazy"
                src="/avatars/user.png"
              ></img>
            )}
          </Link>
        ) : (
          <Link to="/login">
            <img
              className="user-icon"
              loading="lazy"
              src="/avatars/user.png"
            ></img>
          </Link>
        )}

        {query && (
          <ul className="dropdown-menu">
            {loading && (
              <li>
                <LoadingElement />
              </li>
            )}

            {!loading &&
              results.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/${item.media_type}/${item.id}`}
                  reloadDocument={true}
                >
                  <li
                    key={item.id}
                    className={`dropdown-item ${
                      index === cursor ? "active" : ""
                    }`}
                  >
                    {item.poster_path ? (
                      <img
                        loading="lazy"
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
                  </li>
                </Link>
              ))}
            {hasMore && !loading && results.length > 0 && (
              <li
                className="dropdown-item show-more"
                onClick={() => setPage((p) => p + 1)}
              >
                Näytä lisää
              </li>
            )}
          </ul>
        )}
      </div>
    </header>
  );
}
