import axios from "axios";

export default async function uploadAvatar(data) {
  try {
    const response = await axios.post(
      `http://localhost:5555/avatar/upload`,
      data,
      {
        withCredentials: true,
      }
    );
    if (response) return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
}
