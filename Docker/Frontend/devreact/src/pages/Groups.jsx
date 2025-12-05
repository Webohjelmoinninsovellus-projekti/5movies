import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";

import LoadingElement from "../components/LoadingElement";
import { getGroups, createGroup } from "../utilities/groupManager";

export default function Groups() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

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
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="login-box">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Enter group description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </div>
        <button
          onClick={async (e) => {
            e.preventDefault();

            if (!groupName.trim()) {
              alert("Group name cannot be empty");
              return;
            }

            try {
              await createGroup(groupName, groupDescription);

              const updatedGroups = await getGroups();
              if (updatedGroups) {
                setInfo(updatedGroups);
              }

              setGroupName("");
              setGroupDescription("");
            } catch (error) {
              console.error("Error creating group:", error);
              if (error.response?.status === 409) {
                alert("Group name already exists. Please choose another name.");
              } else if (error.response?.status === 403) {
                alert("You do not have permission to create a group.");
              }
            }
          }}
          type="button"
          className="red-button"
        >
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
              <Link key={group.groupid} to={`/group/${group.name}`}>
                <button className="group-card">{group.name}</button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
