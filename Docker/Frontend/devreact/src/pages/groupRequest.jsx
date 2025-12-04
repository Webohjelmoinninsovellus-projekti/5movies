import { useState, useEffect } from "react";
import {
  getGroupRequests,
  acceptRequest,
  rejectRequest,
} from "../utilities/groupJoinRequest";

export default function GroupRequests({ groupid }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchRequests();
  }, [groupid]);

  const handleAccept = async (requestid) => {
    try {
      await acceptRequest(requestid);
      alert("Request accepted!");
      fetchRequests();
    } catch (error) {
      alert("Failed to accept request.");
    }
  };

  const handleReject = async (requestid) => {
    try {
      await rejectRequest(requestid);
      alert("Request rejected.");
      fetchRequests();
    } catch (error) {
      alert("Failed to reject request.");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className="group-requests">
      <h3>Join Requests ({requests.length})</h3>
      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req.requestid} className="request-card">
              <img
                src={req.avatar_url || "/avatars/user.png"}
                alt={req.username}
                className="profile-avatar"
              />
              <div>
                <strong>{req.username}</strong>
                <p>{new Date(req.request_date).toLocaleDateString()}</p>
              </div>
              <div>
                <button
                  className="red-button"
                  onClick={() => handleAccept(req.requestid)}
                >
                  Accept
                </button>
                <button
                  className="red-button"
                  onClick={() => handleReject(req.requestid)}
                  style={{ background: "#555" }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
