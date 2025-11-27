import axios from "axios";

export default async function favoriteSender(
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
