import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";

import LoadingElement from "../components/LoadingElement";

import getGroup from "../utilities/getGroup";

export default function Group() {
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
      const name = params.name;
      const groupData = await getGroup(name);

      if (groupData) {
        setInfo(groupData);
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

          <h3 class="section-title">Lisätyt elokuvat</h3>
          <div class="card-row">
            <div class="card">kuva</div>
            <div class="card">kuva</div>
            <div class="card">kuva</div>
          </div>

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
