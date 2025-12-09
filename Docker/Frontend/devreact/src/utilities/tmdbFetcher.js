import axios from "axios";

const url = import.meta.env.VITE_IP;

async function fetchItemData(type, id) {
  try {
    const mediaType = type === "/mo" ? "movie" : "tv";

    const response = await axios({
      method: "get",
      url: `${url}/tmdb/info/${mediaType}/${id}`,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}

async function fetchDiscovery(type, pageId) {
  try {
    const response = await axios({
      method: "get",
      url: `${url}/tmdb/discovery/${type}/${pageId}`,
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
}

async function fetchPopular() {
  try {
    const response = await axios({
      method: "get",
      url: `${url}/tmdb/popular`,
    });

    if (response) return response.data.results;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}

async function inTheatersData() {
  try {
    const response = await axios({
      method: "get",
      url: `${url}/tmdb/in-theaters`,
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
}

export { fetchItemData, fetchDiscovery, fetchPopular, inTheatersData };
