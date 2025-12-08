import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const url = import.meta.env.VITE_IP;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function loadUser() {
    try {
      const response = await axios.get(`${url}/user/me`, {
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
      await axios.post(`${url}/user/logout`, {}, { withCredentials: true });
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
