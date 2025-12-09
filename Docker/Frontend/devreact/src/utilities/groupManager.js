import axios from "axios";

const url = import.meta.env.VITE_IP;

async function getGroups(myGroups = false) {
  try {
    const getUrl = myGroups ? `${url}/group?my=true` : `${url}/group`;
    const response = await axios.get(getUrl, { withCredentials: true });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group profile:", error);
    return null;
  }
}

async function getGroup(groupName) {
  try {
    const response = await axios.get(`${url}/group/${groupName}`);
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group profile:", error);
    return null;
  }
}

async function getGroupMembers(groupName) {
  try {
    const response = await axios.get(`${url}/group/members/${groupName}`);

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group owner:", error);
    return null;
  }
}

async function addItem(groupName, item) {
  try {
    const res = await axios.post(`${url}/group/${groupName}/add-item`, item, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error adding item to group:", err);
    throw err;
  }
}

async function removeItem(groupName, itemId) {
  try {
    const res = await axios.post(
      `${url}/group/${groupName}/remove-item`,
      { itemId },
      { withCredentials: true }
    );

    return res.data;
  } catch (err) {
    console.error("Error removing item from group:", err);
    throw err;
  }
}

async function getUserGroups(username) {
  try {
    const response = await axios.get(`${url}/user/${username}/groups`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
}

async function createGroup(name, description) {
  try {
    const response = await axios.post(
      `${url}/group/create`,
      { name: name, description },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
}

async function uploadGroupAvatar(groupName, formData) {
  try {
    const response = await axios.post(
      `${url}/group/${groupName}/icon`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading group avatar:", error);
    throw error;
  }
}

async function leaveGroup(groupName) {
  try {
    const response = await axios.post(
      `${url}/group/${groupName}/leave`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error leaving group:", error);
    throw error;
  }
}

async function deleteGroup(groupName) {
  try {
    const response = await axios.delete(`${url}/group/${groupName}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
}

async function sendJoinRequest(groupId) {
  try {
    const res = await axios.post(
      `${url}/group/join/${groupId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Join request failed:", error);
    throw error;
  }
}

export {
  getGroups,
  getGroup,
  getGroupMembers,
  addItem,
  removeItem,
  getUserGroups,
  createGroup,
  uploadGroupAvatar,
  leaveGroup,
  deleteGroup,
  sendJoinRequest,
};
