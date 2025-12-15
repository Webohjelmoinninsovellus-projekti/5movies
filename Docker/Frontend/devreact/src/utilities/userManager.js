import axios from "axios";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const url = import.meta.env.VITE_IP;

async function register(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(`${url}/user/register`, {
      user: inputUser,
    });

    if (response) {
      console.log(response);
      return response;
    }
  } catch (error) {
    console.error("Error registering:", error);
    return error;
  }
}

async function login(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(
      `${url}/user/login`,
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

async function getProfile(username) {
  try {
    const response = await axios.get(`${url}/user/${username}`, {
      withCredentials: true,
    });
    if (response) return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

async function deactivate(username, passwordInput) {
  try {
    const user = { username: username, password: passwordInput };

    const response = await axios.put(`${url}/user/deactivate`, {
      user: user,
    });

    if (response) {
      console.log(response);
      return response;
    }
  } catch (error) {
    console.error("Error deactivating:", error);
    return error;
  }
}

export { register, login, getProfile, deactivate };
