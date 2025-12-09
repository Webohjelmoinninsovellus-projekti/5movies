import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDiscovery } from "../utilities/tmdbFetcher";

import LoadingElement from "../components/LoadingElement";

export default function Movies() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const page1 = await fetchDiscovery("movie", 1);
      const page2 = await fetchDiscovery("movie", 2);
      const merged = page1.concat(page2);
      setMovies(merged);
      setLoading(false);
    }
    loadMovies();
  }, []);

  return (
    <main>
      {!loading ? (
        <div className="container">
          <h2 className="section-title">Horror</h2>
          <div className="category-row">
            {movies
              .filter((item) => item.genre_ids?.includes(27))
              .filter((item, index) => index < 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
          </div>

          <h2 className="section-title">Action</h2>
          <div className="category-row">
            {movies
              .filter((item) => item.genre_ids?.includes(28))
              .filter((item, index) => index < 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
          </div>
          <h2 className="section-title">Science Fiction</h2>
          <div className="category-row">
            {movies
              .filter((item) => item.genre_ids?.includes(878))
              .filter((item, index) => index < 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
          </div>
          <h2 className="section-title">Drama</h2>
          <div className="category-row">
            {movies
              .filter((item) => item.genre_ids?.includes(18))
              .filter((item, index) => index < 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
          </div>
          <h2 className="section-title">Comedy</h2>
          <div className="category-row">
            {movies
              .filter((item) => item.genre_ids?.includes(35))
              .filter((item, index) => index < 4)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ) : (
        <LoadingElement />
      )}
    </main>
  );
}
