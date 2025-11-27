import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";

import LoadingElement from "../components/LoadingElement";
import getGroups from "../utilities/getGroups";

export default function Groups() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [search, setSearch] = useState("");

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const groupData = await getGroups();

      if (groupData) {
        setInfo(groupData);
        console.log(groupData);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingElement />;

  return (
    <div className="groups-wrapper">
      <h2>Create new group</h2>
      <form>
        <div className="login-box">
          <label>Group name:</label>
          <input type="text" placeholder="Enter group name" />
        </div>
        <div className="login-box">
          <label>Description:</label>
          <input type="text" placeholder="Enter group description" />
        </div>
        <button type="submit" className="red-button">
          Create group
        </button>
      </form>
      <div className="groups-search">
        <h2>Groups</h2>
        <div className="login-box">
          <input
            type="text"
            placeholder="Search group"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="groups-info">
          {info
            .filter((info) =>
              info.name.toLowerCase().includes(search.toLowerCase())
            )
            //.filter((info, index) => index < 1)
            .map((group) => (
              <Link to={`/group/${group.name}`}>
                <button className="red-button">{group.name}</button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
