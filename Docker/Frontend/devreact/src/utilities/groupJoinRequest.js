import axios from "axios";

const url = import.meta.env.VITE_IP;

export const sendJoinRequest = async (groupId) => {
  try {
    const response = await axios.post(
      `${url}/group/join/${groupId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending join request:", error);
    throw error;
  }
};

export const getGroupRequests = async (groupId) => {
  try {
    const response = await axios.get(`${url}/group/requests/${groupId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const acceptRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${url}/group/accept/${requestId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${url}/group/reject/${requestId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw error;
  }
};

export const getMyRequests = async () => {
  try {
    const response = await axios.get(`${url}/group/my-requests`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my requests:", error);
    throw error;
  }
};
