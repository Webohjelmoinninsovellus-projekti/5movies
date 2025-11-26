import axios from "axios";

export default async function fetchReviews(type, id) {
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
