import axios from "axios";

const url = import.meta.env.VITE_IP;

export default async function getProfile(username) {
  try {
    const response = await axios.get(`${url}/user/${username}`, {
      withCredentials: true,
    });
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
