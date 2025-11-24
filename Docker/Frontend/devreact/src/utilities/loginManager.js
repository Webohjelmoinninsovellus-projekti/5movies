import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default async function login(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(
      `http://localhost:5555/user/login`,
      {
        user: inputUser,
      },
      { withCredentials: true }
    );

    if (response) {
      return response.data;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}
