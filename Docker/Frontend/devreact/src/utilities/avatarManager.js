import axios from "axios";

const url = import.meta.env.VITE_IP;

export default async function uploadAvatar(data) {
  try {
    const response = await axios.post(`${url}/avatar/upload`, data, {
      withCredentials: true,
    });

    if (response) return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
}
