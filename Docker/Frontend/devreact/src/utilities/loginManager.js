import axios from "axios";
import { Navigate } from "react-router-dom";

export default async function login(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(`http://localhost:5555/user/login`, {
      user: inputUser,
    });

    if (response) {
      console.log(response);
      //setToken(response.data.usertoken);
      localStorage.setItem("JWT", response.data.usertoken);
      return response.data;
    }
  } catch (error) {
    //setToken(null);
    localStorage.removeItem("JWT");
    console.error("Error logging in:", error);
    return null;
  }
}
