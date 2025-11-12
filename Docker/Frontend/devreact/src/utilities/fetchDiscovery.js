import axios from "axios";

export default async function fetchDiscovery(type, pageID) {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      url: `https://api.themoviedb.org/3/discover/${type}?language=en-US&sort_by=popularity.desc&page=${pageID}`,
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
}
