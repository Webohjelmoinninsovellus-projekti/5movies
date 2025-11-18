import axios from "axios";

export default async function login(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(`http://localhost:5555/user/login`, {
      user: inputUser,
    });

    if (response) {
      console.log(response);
      return response.data;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}
