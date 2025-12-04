import { useState, useEffect } from "react";
import {
  getGroupRequests,
  acceptRequest,
  rejectRequest,
} from "../utilities/groupJoinRequest";

export default function GroupRequests({ groupid }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getGroupRequests(groupid);
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [groupid]);

  const refetchRequests = async () => {
    try {
      const data = await getGroupRequests(groupid);
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const handleAccept = async (requestid) => {
    try {
      await acceptRequest(requestid);
      alert("Request accepted!");
      refetchRequests();
    } catch (error) {
      alert("Failed to accept request.");
    }
  };

  const handleReject = async (requestid) => {
    try {
      await rejectRequest(requestid);
      alert("Request rejected.");
      refetchRequests();
    } catch (error) {
      alert("Failed to reject request.");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  if (requests.length === 0) return null;

  return (
    <div className="group-requests">
      <h3>Join Requests ({requests.length})</h3>
      <div className="requests-list">
        {requests.map((req) => (
          <div key={req.requestid} className="request-card">
            <img
              src={
                req.avatar_url
                  ? `http://localhost:5555/uploads/${req.avatar_url}`
                  : "/avatars/user.png"
              }
              alt={req.username}
              className="profile-avatar"
            />
            <div>
              <strong>{req.username}</strong>
              <p style={{ fontSize: "12px", color: "#999" }}>
                {new Date(req.request_date).toLocaleDateString()}
              </p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button
                className="red-button"
                onClick={() => handleAccept(req.requestid)}
              >
                Accept
              </button>
              <button
                className="red-button"
                onClick={() => handleReject(req.requestid)}
                style={{ background: "#ff0000ff" }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
