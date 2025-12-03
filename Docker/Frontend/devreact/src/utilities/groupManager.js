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

export { getGroups, getGroup, addItem, removeItem, getUserGroups };
