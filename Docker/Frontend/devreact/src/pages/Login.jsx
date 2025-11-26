import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";

import login from "../utilities/loginManager";

export default function Login() {
  const [username, setUsername] = useState("");
  const { loadUser } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  /*   const [navigate, setNavigate] = useState(false); */

  const navigate = useNavigate();

  return (
    <main>
      <div className="login-wrapper">
        <h2>LOG IN</h2>
        <div className="login-box">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
              //setUsername(value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              setMessage("");
              const data = await login(username, password);
              console.log(data);

              if (data) {
                await loadUser();
                navigate(`/profile/${data.username}`);
              } else {
                setMessage("Invalid username or password");
              }
            }}
          >
            Login
          </button>
          <p>{message}</p>
        </div>
      </div>
      <div className="login-extra">
        Do not have an account?
        <br />
        <Link to="/register">Create account</Link>
      </div>
      <div className="info-section">
        <div className="info-card">
          <h3>FOLLOW US</h3>
          <div className="social-icons">
            <img src="/social/ig.png" alt="Instagram" />
            <img src="/social/tiktok.png" alt="TikTok" />
            <img src="/social/yt.png" alt="YouTube" />
          </div>
        </div>

        <div className="info-card">
          <h3>DOWNLOAD APP</h3>
          <div className="qr">
            <img src="/social/qr.png" alt="QR" />
          </div>
        </div>
      </div>
    </main>
  );
}
