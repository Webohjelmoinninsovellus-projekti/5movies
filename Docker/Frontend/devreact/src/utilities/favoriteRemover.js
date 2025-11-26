import axios from "axios";

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

export default favoriteRemover;
