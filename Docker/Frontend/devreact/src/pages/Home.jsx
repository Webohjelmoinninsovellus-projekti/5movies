import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import fetchDiscovery from "../utilities/fetchDiscovery";
import SimpleSlider from "../components/SimpleSlider";
import InTheatersSlider from "../components/InTheatersSlider";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    async function loadMovies() {
      const results = await fetchDiscovery("movie", 1);
      setMovies(results);
    }

    async function loadSeries() {
      const results = await fetchDiscovery("tv", 1);
      setSeries(results);
    }
    loadMovies();
    loadSeries();
  }, []);

  return (
    <main>
      <section class="slider">
        <SimpleSlider />
      </section>

      <div class="container">
        <h2 class="section-title">Categories</h2>
        <div class="category-row">
          <div class="card">
            <img src="./scream.png"></img>
            <span>HORROR</span>
          </div>
          <div class="card">
            <img src="JimiKarri.jpg"></img>
            <span>COMEDY</span>
          </div>
          <div class="card">
            <img src="draamaLeo.jpg"></img>
            <span>DRAMA</span>
          </div>
          <div class="card">
            <img src="rambo.jpg"></img>
            <span>ACTION</span>
          </div>
        </div>

        <Link to="/movies">
          <h2 className="section-title">Movies</h2>
        </Link>
        <div className="media-row">
          {movies
            .filter((movie, index) => index < 4)
            .map((movie) => (
              <div key={movie.id} className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <span>{movie.title}</span>
              </div>
            ))}
        </div>

        <Link to="/series">
          <h2 className="section-title">Series</h2>
        </Link>
        <div className="media-row">
          {series
            .filter((movie, index) => index < 4)
            .map((movie) => (
              <div key={movie.id} className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <span>{movie.title}</span>
              </div>
            ))}
        </div>
      </div>

      <section class="slider">
        <InTheatersSlider />
      </section>
    </main>
  );
}
