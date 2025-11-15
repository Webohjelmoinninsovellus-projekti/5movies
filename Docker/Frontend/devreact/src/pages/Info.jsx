import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import fetchItemData from "../utilities/fetchItemData";

export default function Info() {
  const [info, setInfo] = useState(null);
  const params = useParams();
  const type = useLocation().pathname.slice(0, 3);

  useEffect(() => {
    (async () => {
      const data = await fetchItemData(type, params.id);
      console.log(data);

      if (data) setInfo(data);
    })();
  }, [params.id, type]);

  if (!info) {
    return;
  }

  return (
    <main>
      <div id="movieCard">
        <div id="movieText">
          <div id="movieHeader">
            <a href={info.homepage} target="_blank">
              <h2>{`${type === "/mo" ? info.title : info.name}`}</h2>
            </a>
            <p>
              {(type === "/mo" ? info.release_date : info.first_air_date).slice(
                0,
                4
              )}
            </p>
            {type === "/mo" ? (
              <p>{info.runtime} min</p>
            ) : (
              <>
                <p>{info.number_of_seasons} seasons</p>
                <p>{info.number_of_episodes} episodes</p>
              </>
            )}
            <p>{Number(info.vote_average.toFixed(2))} / 10</p>
            {<p>[{info.genres.map((genre) => ` ${genre.name} `)}]</p>}
          </div>
          <p>{info.overview}</p>
        </div>
        <a
          href={`https://image.tmdb.org/t/p/original${info.poster_path}`}
          target="_blank"
        >
          <img
            src={`https://image.tmdb.org/t/p/w400${info.poster_path}`}
            alt={`${type === "/mo" ? info.title : info.name} poster`}
          />
        </a>
      </div>
    </main>
  );
}
