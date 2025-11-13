import axios from "axios";

export default async function fetchPopular() {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
    });

    if (response) return response.data.results;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}
