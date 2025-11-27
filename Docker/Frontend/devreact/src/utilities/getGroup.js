import axios from "axios";

export default async function getGroup(name) {
  try {
    const response = await axios.get(`http://localhost:5555/group/${name}`);
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching group profile:", error);
    return null;
  }
}
