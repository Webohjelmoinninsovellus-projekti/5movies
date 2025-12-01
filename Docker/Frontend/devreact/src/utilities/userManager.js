import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

async function login(usernameInput, passwordInput) {
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

async function register(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post("http://localhost:5555/user/register", {
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

async function deactivate(username, password) {
  try {
    const user = { username: username, password: password };
    const response = await axios.post("http://localhost:5555/user/deactivate", {
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

export { login, register, deactivate };
