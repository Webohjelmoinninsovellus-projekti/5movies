import { useState, useEffect } from "react";
import { useParams } from "react-router";
import fetchMovieData from "../utilities/fetchMovieData";

export default function Movie() {
  const [movieInfo, setMovieInfo] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function loadMovie() {
      const data = await fetchMovieData(params.id);
      console.log(data);

      if (data) setMovieInfo(data);
    }

    loadMovie();
  }, []);

  if (!movieInfo) {
    return;
  }

  return (
    <main>
      <div id="movieCard">
        <div id="movieText">
          <div id="movieHeader">
            <h2>{movieInfo.title}</h2>
            <p>{movieInfo.release_date}</p>
          </div>
          <p>{movieInfo.overview}</p>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w400${movieInfo.poster_path}`}
          alt="Movie poster"
        />
      </div>
    </main>
  );
}
