import axios from "axios";

export default async function fetchMovieData(id) {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      url: `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}
