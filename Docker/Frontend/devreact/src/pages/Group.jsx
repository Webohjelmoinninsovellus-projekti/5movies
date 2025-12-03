import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";

import LoadingElement from "../components/LoadingElement";

import {
  getGroups,
  getGroup,
  addItem,
  removeItem,
} from "../utilities/groupManager";

export default function Group() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [owner, setOwner] = useState(false);
  const [Items, setItems] = useState([]);

  const params = useParams();

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const name = params.name;
      const groupData = await getGroup(name);

      if (groupData) {
        setInfo(groupData);
        setItems(groupData.items || []);
      }
      setLoading(false);
    })();
  }, [params.name]);

  if (loading) return <LoadingElement />;

  if (!info.name) return <h2>Group not found</h2>;

  //console.log("This group's owner: ", owner);

  return (
    <div class="container">
      <div class="group-layout">
        <div>
          <div class="group-img">kuva</div>
          <button class="btn-red">Poistu ryhmästä</button>
        </div>

        <div class="group-info">
          <h2>{info.name}</h2>
          <p>{info.desc}</p>

          <h3 class="section-title">Added movies</h3>
          <div class="card-row"></div>
          {Items && Items.length > 0 ? (
            Items.map((item) => (
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
                          await removeItem(info.name, item.movieshowid);
                          const updatedGroup = await fetchFavorite();
                          if (updatedFavorites) setFavorites(updatedFavorites);
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
            <p>No movies added yet.</p>
          )}

          <h3 class="section-title">Keskustelualue</h3>
          <button class="add-btn">Lisää uusi keskustelu</button>
          <div class="discussion-box"></div>
        </div>

        <div>
          <div class="member-block">
            <h3>Ryhmän omistaja</h3>
            <div class="member">
              <img src="#" />
              <span class="member-name">Rytkön Ville</span>
            </div>
          </div>

          <div class="member-block">
            <h3>Jäsenet</h3>
            <div class="member">
              <img src="#" />
              <span class="member-name">Jari</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
