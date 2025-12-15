import axios from "axios";

const url = import.meta.env.VITE_IP;

async function fetchReviews(type, id) {
  try {
    const mediaType = type === "/mo" ? "movie" : "tv";

    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
      },
      url: `${url}/review/${mediaType}/${id}`,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}

async function sendReview(type, tmdbId, rating, comment) {
  try {
    const response = await axios.post(
      `${url}/review/add`,
      {
        type,
        tmdbId,
        rating,
        comment,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending review:", error);
    throw error;
  }
}

export { fetchReviews, sendReview };
