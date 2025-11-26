import axios from "axios";

export default async function getProfile(username) {
  try {
    const response = await axios.get(`http://localhost:5555/user/${username}`, {
      withCredentials: true,
    });
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
