import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { useParams, useLocation } from "react-router";
import getProfile from "../utilities/getProfile";
import LoadingElement from "../components/LoadingElement";
import GroupRequests from "../components/GroupRequests";

import {
  getGroups,
  getGroup,
  getGroupMembers,
  addItem,
  removeItem,
  uploadGroupAvatar,
  leaveGroup,
  deleteGroup,
  sendJoinRequest,
} from "../utilities/groupManager";

export default function Group() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [members, setMembers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [owner, setOwner] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [Items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const params = useParams();

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const changeGroupAvatar = async (e) => {
    e.preventDefault();
    const avatar = new FormData();
    avatar.append("avatar", e.target.files[0]);

    try {
      const avatarData = await uploadGroupAvatar(info.name, avatar);
      if (avatarData) {
        const updatedGroup = await getGroup(params.name);
        if (updatedGroup) setInfo(updatedGroup);
      }
    } catch (error) {}
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(info.name);
      setMessage("You have left the group.");
    } catch (error) {
      console.error("Failed to leave group:", error);
      if (error.response?.status === 403) {
        setMessage("Group owners cannot leave their own group.");
      } else {
        setMessage("Failed to leave group. Please try again.");
      }
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(info.name);
      setMessage("Group deleted successfully.");
      navigate("/groups");
    } catch (error) {
      console.error("Failed to delete group:", error);
      setMessage("Error deleting group. Please try again.");
    }
  };

  const handleJoinRequest = async () => {
    try {
      await sendJoinRequest(info.groupid);
      setMessage("Request sent! Waiting for owner approval.");
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to send request. Please try again.");
      }
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const name = params.name;
      const groupData = await getGroup(name);
      const membersData = await getGroupMembers(name);

      if (groupData && membersData) {
        setInfo(groupData);
        setMembers(membersData);
        console.log(groupData.items);
        setItems(groupData.items || []);
        if (user && membersData[0].username === user.username) {
          setOwner(true);
          setIsMember(true);
        } else if (
          user &&
          membersData.some((member) => member.username === user.username)
        ) {
          setIsMember(true);
        }
      }

      setLoading(false);
    })();
  }, [params.name, user]);

  if (loading) return <LoadingElement />;

  if (!info.name) return <h2>Group not found</h2>;

  return (
    <div className="container">
      <div className="group-layout">
        <div>
          <div className="group-img">
            {info.avatar_url ? (
              <img
                src={`http://localhost:5555/uploads/${info.avatar_url}`}
                alt={info.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span>No Image</span>
            )}
          </div>
          {owner && (
            <>
              <input
                id="avatar-upload-form"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={changeGroupAvatar}
                style={{ display: "none" }}
              />
              <label
                className="btn-red"
                style={{ display: "inline-flex", justifyContent: "center" }}
                htmlFor="avatar-upload-form"
              >
                Change Image
              </label>

              <button className="btn-red" onClick={handleDeleteGroup}>
                Delete Group
              </button>
            </>
          )}

          {isMember && !owner ? (
            <button className="btn-red" onClick={handleLeaveGroup}>
              {message ? <p>{message}</p> : "Leave Group"}
            </button>
          ) : (
            user &&
            !isMember && (
              <button className="btn-red" onClick={handleJoinRequest}>
                {message ? <p>{message}</p> : "Join Group"}
              </button>
            )
          )}
          {!user && (
            <Link to="/login">
              <button className="btn-red">
                {message ? <p>{message}</p> : "Join Group"}
              </button>
            </Link>
          )}
        </div>

        <div className="group-info">
          <h2>{info.name}</h2>
          <p>{info.desc}</p>

          <h3 className="section-title">Added movies/series</h3>
          <div className="card-row"></div>
          {Items && Items.length > 0 ? (
            Items.map((item) => (
              <div key={item.movieshowid} className="movie-card">
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

                      try {
                        await removeItem(info.name, item.movieshowid);
                        const updatedGroup = await getGroup(params.name);
                        if (updatedGroup) setInfo(updatedGroup);
                        setItems(updatedGroup.items || []);
                        console.log("Removed item:", item.title);
                      } catch (error) {
                        console.error("Failed to remove item:", error);
                        alert("Error removing item. Please try again.");
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
        </div>

        <div>
          <div className="member-block">
            <h3>Group owner</h3>
            <div className="member">
              <img
                className="review-avatar"
                src={
                  members[0].avatar_url
                    ? "http://localhost:5555/uploads/" + members[0].avatar_url
                    : "/avatars/user.png"
                }
              />
              <span className="member-name">{members[0].username}</span>
            </div>
          </div>
          <div className="member-block">
            <h3>Members</h3>
            <div className="member">
              {members
                .filter((member, index) => index > 0)
                .map((member) => (
                  <div key={member.username}>
                    <img
                      className="review-avatar"
                      src={
                        member.avatar_url
                          ? "http://localhost:5555/uploads/" + member.avatar_url
                          : "/avatars/user.png"
                      }
                    ></img>
                    <span className="member-name">{member.username}</span>
                  </div>
                ))}
              {owner && <GroupRequests groupid={info.groupid} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
