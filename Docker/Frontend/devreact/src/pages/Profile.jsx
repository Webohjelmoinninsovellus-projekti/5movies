import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router";

import getProfile from "../utilities/getProfile";

export default function Profile() {
  const [info, setInfo] = useState([]);
  const params = useParams();

  useEffect(() => {
    (async () => {
      const data = await getProfile(params.username);
      console.log(data);

      if (data) setInfo(data);
    })();
  }, [params.username]);

  if (!info.username) return <h2>User not found</h2>;

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
        </section>
        <h2 class="section-title">Omat ryhmät</h2>
        <div class="card-grid">
          <div class="card">5 Movies Testiryhmä</div>
          <div class="card">Ystäväporukan katselulista</div>
          <div class="card">Klassikkojen kerho</div>
        </div>
        <h2 class="section-title">Suosikkielokuvat</h2>
        <div class="movie-grid">
          <div class="movie-card">Terminator</div>
          <div class="movie-card">Star Wars</div>
          <div class="movie-card">Matrix</div>
          <div class="movie-card">Eraserhead</div>
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
