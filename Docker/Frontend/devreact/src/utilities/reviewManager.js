import axios from "axios";

async function fetchReviews(type, id) {
  try {
    const mediaType = type === "/mo" ? "movie" : "tv";

    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
      },
      url: `http://localhost:5555/review/${mediaType}/${id}`,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}

async function sendReview(isMovie, itemId, rating, comment) {
  try {
    const response = await axios.post(
      "http://localhost:5555/review/add",
      {
        isMovie,
        itemId,
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
