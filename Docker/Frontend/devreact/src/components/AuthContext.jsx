import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function loadUser() {
    try {
      const response = await axios.get("http://localhost:5555/user/me", {
        withCredentials: true,
      });
      setUser(response.data);
      console.log("Logged in user:", response.data);
    } catch {
      setUser(null);
    }
  }

  async function logout() {
    try {
      await axios.post(
        "http://localhost:5555/user/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setUser(null);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
