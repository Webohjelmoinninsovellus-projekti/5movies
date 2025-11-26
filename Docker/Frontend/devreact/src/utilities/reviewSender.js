import axios from "axios";

export default async function reviewSender(
  ismovie,
  comment,
  movieshowid,
  rating
) {
  try {
    const response = await axios.post(
      "http://localhost:5555/review/add",
      {
        ismovie,
        comment,
        movieshowid,
        rating,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending review:", error);
    throw error;
  }
}
