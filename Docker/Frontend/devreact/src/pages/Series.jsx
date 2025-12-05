import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDiscovery } from "../utilities/tmdbFetcher";

import LoadingElement from "../components/LoadingElement";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeries() {
      setLoading(true);
      const page1 = await fetchDiscovery("tv", 1);
      const page2 = await fetchDiscovery("tv", 2);
      const merged = page1.concat(page2);
      setSeries(merged);
      setLoading(false);
    }
    loadSeries();
  }, []);

  return (
    <main>
      {!loading ? (
        <div className="container">
          <h2 className="section-title">Animation</h2>
          <div className="category-row">
            {series
              .filter((movie) => movie.genre_ids?.includes(16))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link
                  key={movie.id}
                  to={`/tv/${movie.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.name}
                    />
                    <span>{movie.name}</span>
                  </div>
                </Link>
              ))}
          </div>

          <h2 className="section-title">Action</h2>
          <div className="category-row">
            {series
              .filter((movie) => movie.genre_ids?.includes(10759))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link
                  key={movie.id}
                  to={`/tv/${movie.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.name}
                    />
                    <span>{movie.name}</span>
                  </div>
                </Link>
              ))}
          </div>
          <h2 className="section-title">Mystery</h2>
          <div className="category-row">
            {series
              .filter((movie) => movie.genre_ids?.includes(9648))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link
                  key={movie.id}
                  to={`/tv/${movie.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.name}
                    />
                    <span>{movie.name}</span>
                  </div>
                </Link>
              ))}
          </div>
          <h2 className="section-title">Drama</h2>
          <div className="category-row">
            {series
              .filter((movie) => movie.genre_ids?.includes(18))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link
                  key={movie.id}
                  to={`/tv/${movie.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.name}
                    />
                    <span>{movie.name}</span>
                  </div>
                </Link>
              ))}
          </div>
          <h2 className="section-title">Comedy</h2>
          <div className="category-row">
            {series
              .filter((movie) => movie.genre_ids?.includes(35))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link
                  key={movie.id}
                  to={`/tv/${movie.id}`}
                  reloadDocument={true}
                >
                  <div className="card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.name}
                    />
                    <span>{movie.name}</span>
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
