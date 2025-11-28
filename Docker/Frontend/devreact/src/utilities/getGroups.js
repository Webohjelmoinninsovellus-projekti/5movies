import axios from "axios";

export default async function getGroups() {
  try {
    const response = await axios.get(`http://localhost:5555/group`);
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    return null;
  }
}
