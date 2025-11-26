import axios from "axios";

export default async function fetchItemData(type, id) {
  try {
    const mediaType = type === "/mo" ? "movie" : "tv";

    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      url: `https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}
