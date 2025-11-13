import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import fetchItemData from "../utilities/fetchItemData";

export default function Info() {
  const [details, setDetails] = useState(null);
  const params = useParams();
  const type = useLocation().pathname.slice(0, 3);

  useEffect(() => {
    async function loadData() {
      const data = await fetchItemData(type, params.id);
      console.log(data);

      if (data) setDetails(data);
    }

    loadData();
  }, []);

  if (!details) {
    return;
  }

  return (
    <main>
      <div id="movieCard">
        <div id="movieText">
          <div id="movieHeader">
            <h2>{details.title}</h2>
            <p>{details.release_date}</p>
          </div>
          <p>{details.overview}</p>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w400${details.poster_path}`}
          alt="Movie poster"
        />
      </div>
    </main>
  );
}

/*


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
}
 */
