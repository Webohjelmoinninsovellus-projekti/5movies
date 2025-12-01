import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchDiscovery } from "../utilities/tmdbFetcher";

import LoadingElement from "../components/LoadingElement";

export default function Series() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeries() {
      const results = await fetchDiscovery("tv", 1);
      //console.log("Fetched movies:", results);
      setSeries(results);
    }
    loadSeries();
  }, []);

  return (
    <main>
      <div className="container">
        <h2 className="section-title">Horror</h2>
        <div className="category-row">
          {series
            .filter((movie) => movie.genre_ids?.includes(27))
            .filter((movie, index) => index < 4)
            .map((movie) => (
              <Link to={`/tv/${movie.id}`} reloadDocument={true}>
                <div key={movie.id} className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
                </div>
              </Link>
            ))}
        </div>

        <h2 className="section-title">Action</h2>
        <div className="category-row">
          {series
            .filter((movie) => movie.genre_ids?.includes(28))
            .filter((movie, index) => index < 4)
            .map((movie) => (
              <Link to={`/tv/${movie.id}`} reloadDocument={true}>
                <div key={movie.id} className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
                </div>
              </Link>
            ))}
        </div>
        <h2 className="section-title">Science Fiction</h2>
        <div className="category-row">
          {series
            .filter((movie) => movie.genre_ids?.includes(878))
            .filter((movie, index) => index < 4)
            .map((movie) => (
              <Link to={`/tv/${movie.id}`} reloadDocument={true}>
                <div key={movie.id} className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
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
              <Link to={`/tv/${movie.id}`} reloadDocument={true}>
                <div key={movie.id} className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
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
              <Link to={`/tv/${movie.id}`} reloadDocument={true}>
                <div key={movie.id} className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                  />
                  <span>{movie.title}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
