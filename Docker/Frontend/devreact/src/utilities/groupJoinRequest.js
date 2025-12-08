import axios from "axios";

const url = import.meta.env.VITE_IP;

export const sendJoinRequest = async (groupid) => {
  try {
    const response = await axios.post(
      `${url}/group/join/${groupid}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending join request:", error);
    throw error;
  }
};

export const getGroupRequests = async (groupid) => {
  try {
    const response = await axios.get(`${url}/group/requests/${groupid}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const acceptRequest = async (requestid) => {
  try {
    const response = await axios.post(
      `${url}/group/accept/${requestid}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

export const rejectRequest = async (requestid) => {
  try {
    const response = await axios.post(
      `${url}/group/reject/${requestid}`,
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
