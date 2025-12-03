import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";

import LoadingElement from "../components/LoadingElement";

import getProfile from "../utilities/getProfile";
import { getUserGroups } from "../utilities/groupManager";
import uploadAvatar from "../utilities/avatarManager";
import { fetchFavorite, favoriteRemover } from "../utilities/favoriteManager";
import { deactivate } from "../utilities/userManager";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [owner, setOwner] = useState(false);
  const [deactivationInputActive, setDeactivationInputActive] = useState(false);
  const [deactivationPassword, setDeactivationPassword] = useState("");
  const profileAudio = new Audio("/sounds/notification-bell.mp3");
  const [groups, setGroups] = useState([]);

  const params = useParams();

  const avatar = "http://localhost:5555/uploads/" + info.avatar_url;

  const { user, logout, loadUser } = useContext(AuthContext);

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

      const groupsData = await getUserGroups(params.username);
      if (groupsData) setGroups(groupsData);
      console.log(groupsData);
      setLoading(false);
    })();
  }, [params.username]);

  const changeAvatar = async (e) => {
    e.preventDefault();
    const avatar = new FormData();
    avatar.append("avatar", e.target.files[0]);
    const avatarData = await uploadAvatar(avatar);
    if (avatarData) window.location.reload();
  };

  const deactivateAccount = async () => {
    const result = await deactivate(params.username, deactivationPassword);

    if (result.status === 200) {
      alert(
        "Your account is now deactivated. Your account and all associated data will be deleted after 30 days. You can reactivate your account by logging back in within the 30 days."
      );
      await logout();
      navigate("/login");
    } else {
      alert("Incorrect password.");
    }
  };

  useEffect(() => {
    if (user && info) {
      setLoading(true);
      setOwner(user.username === info.username);
      setLoading(false);
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
              {avatar ? (
                <img src={avatar}></img>
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
                      <form>
                        <input
                          className="avatar-upload-form"
                          id="avatar-upload"
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={changeAvatar}
                        />
                        <label
                          type="button"
                          htmlFor="avatar-upload"
                          className="red-button"
                        >
                          Change Avatar
                        </label>
                      </form>
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
                    <button
                      className="red-button"
                      onClick={async (e) => {
                        if (deactivationPassword === "") {
                          if (!deactivationInputActive) {
                            setDeactivationInputActive(true);

                            setTimeout(() => {
                              const inputField =
                                document.getElementsByName(
                                  "deactivationInput"
                                )[0];

                              if (inputField !== null) {
                                inputField.focus();
                              }
                            }, 8);
                          } else {
                            const inputField =
                              document.getElementsByName(
                                "deactivationInput"
                              )[0];

                            if (inputField !== null) {
                              inputField.focus();
                            }
                          }
                        } else {
                          deactivateAccount();
                        }
                      }}
                    >
                      Deactivate account
                    </button>
                    {deactivationInputActive && (
                      <input
                        className="red-button"
                        placeholder="Insert password"
                        name="deactivationInput"
                        type="password"
                        onChange={(e) => {
                          setDeactivationPassword(e.target.value);
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") deactivateAccount();
                        }}
                      />
                    )}
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
          <h2 class="section-title">Groups</h2>
          <div class="movie-grid">
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.groupid} class="movie-card">
                  <Link to={`/group/${group.name}`} className="movie-card-link">
                    <div class="group-poster">
                      {group.avatar_url ? (
                        <img
                          src={`http://localhost:5555/uploads/${group.avatar_url}`}
                          alt={group.name}
                        />
                      ) : (
                        <div class="no-poster">{group.name}</div>
                      )}
                    </div>
                    <div class="movie-info">
                      <h3 class="movie-title">{group.name}</h3>
                      <p class="movie-year">{group.count || 0} members</p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No groups joined yet.</p>
            )}
          </div>
        </div>
      ) : (
        <LoadingElement />
      )}
    </main>
  );
}
