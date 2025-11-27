import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { AuthContext } from "../components/AuthContext";
import LoadingElement from "../components/LoadingElement";

import fetchItemData from "../utilities/fetchItemData";
import fetchReviews from "../utilities/fetchReviews";
import reviewSender from "../utilities/reviewSender";
import favoriteSender from "../utilities/favoriteSender";
import favoriteRemover from "../utilities/favoriteRemover";

export default function Info() {
  const [loading, setLoading] = useState(true);

  const [info, setInfo] = useState(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [reviews, setReviews] = useState([]);
  const [favoriteAdded, setFavoriteAdded] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");
  const [favoriteRemoved, setFavoriteRemoved] = useState(false);

  const { user } = useContext(AuthContext);

  const params = useParams();
  const type = useLocation().pathname.slice(0, 3);

  const location = useLocation();

  const totalStars = 5;

  const handleClick = async (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const itemData = await fetchItemData(type, params.id);
      if (itemData) setInfo(itemData);

      const reviewsData = await fetchReviews(type, params.id);
      if (reviewsData) setReviews(reviewsData);

      setLoading(false);
    })();
  }, [params.id, type]);

  if (!info) {
    return;
  }

  return (
    <main>
      {!loading ? (
        <div id="movieCard">
          <div id="movieText">
            <div id="movieHeader">
              <a href={info.homepage} target="_blank">
                <h2>{type === "/mo" ? info.title : info.name}</h2>
              </a>
              <p>
                {(type === "/mo"
                  ? info.release_date
                  : info.first_air_date
                ).slice(0, 4)}
              </p>
              {type === "/mo" ? (
                <p>{info.runtime} min</p>
              ) : (
                <>
                  <p>• {info.number_of_seasons} seasons</p>
                  <p>• {info.number_of_episodes} episodes</p>
                </>
              )}
              <p>• {Number(info.vote_average.toFixed(2))} / 10</p>
              {<p>• [{info.genres.map((genre) => ` ${genre.name} `)}]</p>}
            </div>
            <p>{info.overview}</p>
            {user && (
              <>
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
                          color:
                            value <= (hover || rating) ? "#eb1919ff" : "#ccc",
                          transition: "0.3s",
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
                  style={{
                    width: "300px",
                    height: "50px",
                    fontSize: "15px",
                    marginTop: "10px",
                  }}
                />
                <button
                  className="red-button"
                  onClick={async () => {
                    await reviewSender(
                      type === "/mo" ? true : false,
                      comment,
                      info.id,
                      rating
                    );

                    /* if (data) {
                    navigate(`/Info/${data.comment}`);
                  } */

                    // TODO : update reviews automatically after submitting review
                    //setReviews(reviews + [])
                  }}
                >
                  Submit Review
                </button>
                <button
                  className="red-button"
                  onClick={async () => {
                    if (favoriteAdded) return;

                    try {
                      await favoriteSender(
                        type === "/mo" ? true : false,
                        info.id,
                        type === "/mo" ? info.title : info.name,
                        info.poster_path,
                        parseInt(
                          (type === "/mo"
                            ? info.release_date
                            : info.first_air_date
                          ).slice(0, 4)
                        )
                      );
                      setFavoriteAdded(true);
                      setFavoriteRemoved(false);
                      setFavoriteError("");
                    } catch (error) {
                      console.error("Failed to add favorite:", error);
                      if (
                        error.response?.status === 409 ||
                        error.response?.data?.message?.includes("duplicate")
                      ) {
                        setFavoriteError("Already added to favorites!");
                      } else {
                        setFavoriteError(
                          "Failed to add to favorites. Please try again."
                        );
                      }
                      setTimeout(() => setFavoriteError(""), 3000);
                    }
                  }}
                  disabled={favoriteAdded}
                  style={{
                    opacity: favoriteAdded ? 0.6 : 1,
                    cursor: favoriteAdded ? "not-allowed" : "pointer",
                    marginRight: "10px",
                  }}
                >
                  {favoriteAdded ? "✓ Added to favorites" : "Add to favorites"}
                </button>
                {favoriteAdded && !favoriteRemoved && (
                  <p
                    style={{
                      color: "#4CAF50",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Successfully added to your favorites!
                  </p>
                )}
                {favoriteRemoved && (
                  <p
                    style={{
                      color: "#ff9800",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Removed from your favorites!
                  </p>
                )}
                {favoriteError && (
                  <p
                    style={{
                      color: "#ff6b6b",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {favoriteError}
                  </p>
                )}
              </>
            )}
            <div>
              <h2>Reviews</h2>
              {reviews.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "1rem",
                  }}
                >
                  {reviews.map((item) => (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "0.6rem",
                        border: "0.1rem solid red",
                        borderRadius: "10px",
                      }}
                    >
                      <Link to={`/profile/${item.username}`}>
                        <h2>{item.username}</h2>
                      </Link>
                      <h3>{item.rating}/5</h3>
                      <p>{item.comment}</p>
                      <p>{item.date.slice(0, 10)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No reviews.</p>
              )}
            </div>
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
      ) : (
        <LoadingElement />
      )}
    </main>
  );
}
