import axios from "axios";

export default async function register(usernameInput, passwordInput) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(`http://localhost:5555/user/register`, {
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
