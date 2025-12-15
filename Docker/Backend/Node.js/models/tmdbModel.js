import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE = "https://api.themoviedb.org/3/";

async function fetchTmdb(path) {
  const response = await axios({
    method: "get",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
    url: BASE + path,
  });

  return response.data;
}
