import axios from "axios";

async function getGroups() {
  try {
    const response = await axios.get(`http://localhost:5555/group`);
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group profile:", error);
    return null;
  }
}

async function getGroup(name) {
  try {
    const response = await axios.get(`http://localhost:5555/group/${name}`);
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group profile:", error);
    return null;
  }
}

async function getGroupMembers(name) {
  try {
    const response = await axios.get(
      `http://localhost:5555/group/members/${name}`
    );
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group owner:", error);
    return null;
  }
}

async function addItem(groupname, item) {
  try {
    const res = await axios.post(
      `http://localhost:5555/group/${groupname}/additem`,
      item,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding item to group:", err);
    throw err;
  }
}

async function removeItem(groupname, movieshowid) {
  try {
    const res = await axios.post(
      `http://localhost:5555/group/${groupname}/removeitem`,
      { movieshowid },
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
    const response = await axios.get(
      `http://localhost:5555/user/${username}/groups`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
}

async function createGroup(name, desc) {
  try {
    const response = await axios.post(
      `http://localhost:5555/group/create`,
      { name, desc },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
}

async function uploadGroupAvatar(groupname, formData) {
  try {
    const response = await axios.post(
      `http://localhost:5555/group/${groupname}/avatar`,
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

async function leaveGroup(groupname) {
  try {
    const response = await axios.post(
      `http://localhost:5555/group/${groupname}/leave`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error leaving group:", error);
    throw error;
  }
}

async function deleteGroup(groupname) {
  try {
    const response = await axios.delete(
      `http://localhost:5555/group/${groupname}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
}

async function sendJoinRequest(name) {
  try {
    const res = await axios.post(
      `http://localhost:5555/group/${name}/request`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Join request failed:", error);
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
