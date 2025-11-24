/*import axios from "axios";

export default async function Info(review, setReview) {
  try {
    const inputUser = { username: usernameInput, password: passwordInput };
    const response = await axios.post(`http://localhost:5555/reviews`, {
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
}*/

import axios from "axios";

export default async function reviewSender(comment) {
  try {
    const response = await axios.post("http://localhost:5555/review/add", {
      comment,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending review:", error);
    throw error;
  }
}
