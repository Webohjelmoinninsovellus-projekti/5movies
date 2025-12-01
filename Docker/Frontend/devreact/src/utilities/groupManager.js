import axios from "axios";

async function getGroups(name) {
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
      `http://localhost:5555/group/${groupName}/additem`,
      item,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding item to group:", err);
    throw err;
  }
}

async function removeItem(groupName, movieshowid) {
  try {
    const res = await axios.post(
      `http://localhost:5555/group/${groupid}/removeitem`,
      { movieshowid },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Error removing item from group:", err);
    throw err;
  }
}

export { getGroups, addItem, removeItem };
