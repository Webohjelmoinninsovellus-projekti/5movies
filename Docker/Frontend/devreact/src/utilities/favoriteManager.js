import axios from "axios";

const url = import.meta.env.VITE_IP;

async function fetchFavorite(username) {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
      },
      url: `${url}/favorite/${username}`,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}

async function favoriteSender(type, tmdbId, title, releaseYear, posterPath) {
  try {
    const response = await axios.post(
      `${url}/favorite/add`,
      {
        type,
        tmdbId,
        title,
        releaseYear,
        posterPath,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending favorite:", error);
    throw error;
  }
}

// BUG: removes item despite not knowing type
async function favoriteRemover(tmdbId) {
  try {
    const response = await axios({
      method: "delete",
      url: `${url}/favorite/remove/${tmdbId}`,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error removing favorite:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
}

export { fetchFavorite, favoriteSender, favoriteRemover };
