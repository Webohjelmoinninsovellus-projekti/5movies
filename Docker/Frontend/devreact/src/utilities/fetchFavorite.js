import axios from "axios";

export default async function fetchFavorite(username) {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
      },
      url: `http://localhost:5555/favorite/${username}`,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}
