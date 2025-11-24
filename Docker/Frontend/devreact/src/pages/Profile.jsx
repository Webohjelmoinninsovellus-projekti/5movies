import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams } from "react-router";

import getProfile from "../utilities/getProfile";

export default function Profile() {
  const { user, loadUser, logout } = useContext(AuthContext);
  const [info, setInfo] = useState([]);
  const [owner, setOwner] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getProfile(params.username);

      if (data) {
        setInfo(data);
      }
    })();
  }, [params.username]);

  useEffect(() => {
    if (user && info) {
      setOwner(user.username === info.username);
    }
  }, [user, info]);

  if (!info.username) return <h2>User not found</h2>;

  console.log("This profile's owner: ", owner);

  return (
    <main>
      <div class="container">
        <section class="profile-section">
          <div class="avatar">
            <img src={info.avatar_url}></img>
          </div>
          <div class="profile-info">
            <h2>{info.username}</h2>
            <p>Joined: {info.datecreated.split("T")[0]}</p>
            <p>{info.desc ? info.desc : ""}</p>
          </div>
          {owner && (
            <>
              <div>
                <button>✏️</button>
              </div>
              <div>
                <button
                  onClick={async () => {
                    const data = await logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </section>
        <h2 class="section-title">Favorites</h2>
        <div class="movie-grid">
          <div class="movie-card"></div>
          <div class="movie-card"></div>
          <div class="movie-card"></div>
          <div class="movie-card"></div>
        </div>
        <h2 class="section-title">Viimeisin aktiivisuus</h2>
        <ul class="activity-list">
          <li>Arvosteli: Star Wars (5/5)</li>
          <li>Liittyi ryhmään: Klassikkojen kerho</li>
          <li>Lisäsi suosikkeihin: Terminator</li>
          <li>Kommentoi ryhmässä: "Tää pitää nähdä uudestaan!"</li>
        </ul>
      </div>
    </main>
  );
}
