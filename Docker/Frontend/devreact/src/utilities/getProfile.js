import axios from "axios";

export default async function getProfile(username) {
  try {
    localStorage.getItem("JWT");
    const response = await axios.get(`http://localhost:5555/user/${username}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("JWT")}`,
      },
    });
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
