import axios from "axios";

async function fetchFavorite(username) {
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

async function favoriteSender(
  ismovie,
  movieshowid,
  title,
  poster_path,
  release_year
) {
  try {
    const response = await axios.post(
      "http://localhost:5555/favorite/add",
      {
        ismovie,
        movieshowid,
        title,
        poster_path,
        release_year,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending favorite:", error);
    throw error;
  }
}

async function favoriteRemover(movieshowid) {
  try {
    const response = await axios({
      method: "delete",
      url: `http://localhost:5555/favorite/remove/${movieshowid}`,
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
