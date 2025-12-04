import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router";
import { Link } from "react-router-dom";

import { AuthContext } from "../components/AuthContext";
import LoadingElement from "../components/LoadingElement";

import { fetchItemData } from "../utilities/tmdbFetcher";
import { fetchReviews, sendReview } from "../utilities/reviewManager";
import { favoriteSender } from "../utilities/favoriteManager";
import { addItem, removeItem, getGroups } from "../utilities/groupManager";

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
  const [groupName, setGroupName] = useState("");
  const [groupError, setGroupError] = useState("");
  const [movieAdded, setMovieAdded] = useState(false);
  const [movieRemoved, setMovieRemoved] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

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

      if (user) {
        const userGroups = await getGroups();
        if (userGroups) setGroups(userGroups);
      }

      setLoading(false);
    })();
  }, [params.id, type, user]);

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
                    await sendReview(
                      type === "/mo" ? true : false,
                      info.id,
                      rating,
                      comment
                    );
                    const reviewsData = await fetchReviews(type, params.id);
                    if (reviewsData) setReviews(reviewsData);

                    setComment("");
                    setRating(0);

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
                        parseInt(
                          (type === "/mo"
                            ? info.release_date
                            : info.first_air_date
                          ).slice(0, 4)
                        ),
                        info.poster_path
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

                <div>
                  <select
                    className="red-button"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                      <option key={group.groupid} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="red-button"
                    onClick={async () => {
                      if (!selectedGroup) {
                        setGroupError("Please select a group first!");
                        setTimeout(() => setGroupError(""), 3000);
                        return;
                      }

                      try {
                        await addItem(selectedGroup, {
                          movieshowid: info.id,
                          ismovie: type === "/mo" ? true : false,
                          title: type === "/mo" ? info.title : info.name,
                          poster_path: info.poster_path,
                          release_year: parseInt(
                            (type === "/mo"
                              ? info.release_date
                              : info.first_air_date
                            ).slice(0, 4)
                          ),
                        });

                        setMovieAdded(true);
                        setMovieRemoved(false);
                        setGroupError("");

                        setTimeout(() => setMovieAdded(false), 3000);
                      } catch (error) {
                        console.error("Failed to add to group:", error);

                        if (error.response?.status === 409) {
                          setGroupError("Already added to this group!");
                        } else {
                          setGroupError(
                            "Failed to add to group. Please try again."
                          );
                        }
                        setTimeout(() => setGroupError(""), 3000);
                      }
                    }}
                    disabled={!selectedGroup}
                    style={{
                      opacity: !selectedGroup ? 0.6 : 1,
                      cursor: !selectedGroup ? "not-allowed" : "pointer",
                    }}
                  >
                    Add to group
                  </button>
                </div>

                {movieAdded && !movieRemoved && (
                  <p
                    style={{
                      color: "#4CAF50",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓ Successfully added to the group!
                  </p>
                )}

                {groupError && (
                  <p
                    style={{
                      color: "#ff6b6b",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {groupError}
                  </p>
                )}

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
                        width: "33%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Link to={`/profile/${item.username}`}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {item.avatar_url ? (
                            <img
                              className="review-avatar"
                              src={
                                "http://localhost:5555/uploads/" +
                                item.avatar_url
                              }
                            ></img>
                          ) : (
                            <img
                              className="review-avatar"
                              src={"/avatars/user.png"}
                            ></img>
                          )}
                          <h3>{item.username}</h3>
                        </div>
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
