import axios from "axios";

export default async function getProfile(username) {
  try {
    const response = await axios.get(`/${username}`);
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}
