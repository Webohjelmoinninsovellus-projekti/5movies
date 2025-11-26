import axios from "axios";

export default async function favoriteSender(ismovie, movieshowid) {
  try {
    const response = await axios.post(
      "http://localhost:5555/favorite/add",
      {
        ismovie,
        movieshowid,
      },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending review:", error);
    throw error;
  }
}
