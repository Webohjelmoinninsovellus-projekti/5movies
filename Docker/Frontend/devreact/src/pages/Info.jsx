import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import fetchItemData from "../utilities/fetchItemData";
import reviewSender from "../utilities/reviewSender";
import { useNavigate } from "react-router";

export default function Info() {
  const [info, setInfo] = useState(null);
  const params = useParams();
  const type = useLocation().pathname.slice(0, 3);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const totalStars = 5;

  const handleClick = async (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

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
          <div
            style={{
              display: "flex",
              cursor: "pointer",
              gap: "5px",
              fontSize: "32px",
            }}
          >
            {Array.from({ length: totalStars }, (_, i) => {
              const value = i + 1;
              return (
                <span
                  key={value}
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    color: value <= (hover || rating) ? "#eb1919ff" : "#ccc",
                    transition: "0.2s",
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={async () => {
              const data = await reviewSender(comment);
              console.log(data);

              if (data) {
                navigate(`/Info/${data.comment}`);
              }
            }}
          >
            Submit Review
          </button>
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
