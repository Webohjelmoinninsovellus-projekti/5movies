import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";

import LoadingElement from "../components/LoadingElement";

import getProfile from "../utilities/getProfile";
import fetchFavorite from "../utilities/fetchFavorite";
import favoriteRemover from "../utilities/favoriteRemover";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [owner, setOwner] = useState(false);

  const params = useParams();

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const username = params.username;
      const profileData = await getProfile(username);

      if (profileData) {
        setInfo(profileData);
        console.log(profileData);
      }

      const favoritesData = await fetchFavorite(params.username);
      if (favoritesData) setFavorites(favoritesData);
      setLoading(false);
    })();
  }, [params.username]);

  useEffect(() => {
    if (user && info) {
      setLoading(true);
      setOwner(user.username === info.username);
      setLoading(true);
    }
  }, [user, info]);

  if (loading)
    return (
      <main className="page-wrapper">
        <LoadingElement />
      </main>
    );

  if (!info.username) return <h2>User not found</h2>;

  console.log("This profile's owner: ", owner);

  return (
    <main>
      {!loading ? (
        <div class="container">
          <section class="profile-section">
            <div class="avatar">
              {info.avatar_url ? (
                <img src={info.avatar_url}></img>
              ) : (
                <img src="/avatars/user.png"></img>
              )}
            </div>
            <div class="profile-info">
              <h2>{info.username}</h2>
              <p>Joined: {info.datecreated.split("T")[0]}</p>
              <p>{info.desc ? info.desc : ""}</p>
              {owner && (
                <>
                  <nav className="nav-items">
                    <div>
                      <button className="red-button">✏️</button>
                    </div>
                    <div>
                      <button
                        className="red-button"
                        onClick={async () => {
                          const data = await logout();
                          navigate("/login");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </nav>
                </>
              )}
            </div>
          </section>
          <h2 class="section-title">Favorites</h2>
          <div class="movie-grid">
            {favorites && favorites.length > 0 ? (
              favorites.map((item) => (
                <div key={item.movieshowid} class="movie-card">
                  <Link
                    to={`/${item.ismovie ? "movie" : "tv"}/${item.movieshowid}`}
                    className="movie-card-link"
                  >
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w400${item.poster_path}`}
                        alt={item.title}
                      />
                    ) : (
                      <div class="no-poster">No Poster</div>
                    )}
                    <div class="movie-info">
                      <h3 class="movie-title">{item.title}</h3>
                      <p class="movie-year">{item.release_year}</p>
                    </div>
                  </Link>
                  {owner && (
                    <button
                      className="favorite-remove-btn"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        {
                          try {
                            await favoriteRemover(item.movieshowid);
                            const updatedFavorites = await fetchFavorite(
                              params.username
                            );
                            if (updatedFavorites)
                              setFavorites(updatedFavorites);
                            console.log("Removed favorite:", item.title);
                          } catch (error) {
                            console.error("Failed to remove favorite:", error);
                            alert("Failed to remove from favorites.");
                          }
                        }
                      }}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>No favorites added yet.</p>
            )}
          </div>
          <h2 class="section-title">Latest activity</h2>
          <ul class="activity-list">
            <li>Arvosteli: star wurs (5/5)</li>
            <li>Liittyi ryhmään: doghouse</li>
            <li>Lisäsi suosikkeihin: </li>
            <li>Kommentoi ryhmässä: "natsaa!"</li>
          </ul>
        </div>
      ) : (
        <LoadingElement />
      )}
    </main>
  );
}
