import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams } from "react-router";

import LoadingElement from "../components/LoadingElement";

import { getUserGroups } from "../utilities/groupManager";
import uploadAvatar from "../utilities/avatarManager";
import { fetchFavorite, favoriteRemover } from "../utilities/favoriteManager";
import { getProfile, deactivate } from "../utilities/userManager";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [deactivationInputActive, setDeactivationInputActive] = useState(false);
  const [deactivationPassword, setDeactivationPassword] = useState("");
  const [groups, setGroups] = useState([]);

  const params = useParams();

  const url = import.meta.env.VITE_IP;
  const avatar = url + "/uploads/" + info.avatar_path;

  const { user, logout } = useContext(AuthContext);
  const owner = user && info.username === user.username;

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const username = params.username;
      const profileData = await getProfile(username);

      if (profileData) {
        setInfo(profileData);
      }

      const favoritesData = await fetchFavorite(params.username);
      if (favoritesData) setFavorites(favoritesData);

      const groupsData = await getUserGroups(params.username);
      if (groupsData) setGroups(groupsData);

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

  if (loading)
    return (
      <main className="page-wrapper">
        <LoadingElement />
      </main>
    );

  if (!info.username) return <h2>User not found</h2>;

  return (
    <main>
      {!loading ? (
        <div className="container">
          <section className="profile-section">
            <div className="avatar">
              {avatar ? (
                <img loading="lazy" src={avatar}></img>
              ) : (
                <img loading="lazy" src="/avatars/user.png"></img>
              )}
            </div>
            <div className="profile-info">
              <h2>{info.username}</h2>
              <p>Joined: {info.date_created.split("T")[0]}</p>
              <p>{info.bio ? info.bio : ""}</p>
              {owner && (
                <>
                  <nav className="profile-nav-items">
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
                          await logout();
                          navigate("/login");
                        }}
                      >
                        Logout
                      </button>
                    </div>
                    <button
                      className="red-button"
                      onClick={async () => {
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
          <h2 className="section-title">Favorites</h2>
          <div className="movie-grid">
            {favorites && favorites.length > 0 ? (
              favorites.map((item) => (
                <div key={item.tmdb_id} className="movie-card">
                  <Link
                    to={`/${item.type ? "movie" : "tv"}/${item.tmdb_id}`}
                    className="movie-card-link"
                  >
                    {item.poster_path ? (
                      <img
                        loading="lazy"
                        src={`https://image.tmdb.org/t/p/w400${item.poster_path}`}
                        alt={item.title}
                      />
                    ) : (
                      <div className="no-poster">No Poster</div>
                    )}
                    <div className="movie-info">
                      <h3 className="movie-title">{item.title}</h3>
                      <p className="movie-year">{item.release_year}</p>
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
                            await favoriteRemover(item.tmdb_id);
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
          <h2 className="section-title">Groups</h2>
          <div className="movie-grid">
            {groups && groups.length > 0 ? (
              groups.map((group) => (
                <div key={group.id_group} className="movie-card">
                  <Link to={`/group/${group.name}`} className="movie-card-link">
                    <div className="group-poster">
                      {group.icon_path && (
                        <img
                          loading="lazy"
                          src={`${url}/uploads/${group.icon_path}`}
                          alt={group.name}
                        />
                      )}
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{group.name}</h3>
                      <p className="movie-year">
                        {group.member_count || 0} members
                      </p>
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
