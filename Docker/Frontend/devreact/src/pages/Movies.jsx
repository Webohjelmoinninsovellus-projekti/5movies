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
              .filter((movie) => movie.genre_ids?.includes(27))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link to={`/movie/${movie.id}`} reloadDocument={true}>
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
            {movies
              .filter((movie) => movie.genre_ids?.includes(28))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link to={`/movie/${movie.id}`} reloadDocument={true}>
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
            {movies
              .filter((movie) => movie.genre_ids?.includes(878))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link to={`/movie/${movie.id}`} reloadDocument={true}>
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
            {movies
              .filter((movie) => movie.genre_ids?.includes(18))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link to={`/movie/${movie.id}`} reloadDocument={true}>
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
            {movies
              .filter((movie) => movie.genre_ids?.includes(35))
              .filter((movie, index) => index < 4)
              .map((movie) => (
                <Link to={`/movie/${movie.id}`} reloadDocument={true}>
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
      ) : (
        <LoadingElement />
      )}
    </main>
  );
}
