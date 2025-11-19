import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import login from "../utilities/loginManager";

export default function Login() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
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
              const data = await login(username, password);
              console.log(data);

              if (data) {
                navigate(`/profile/${data.username}`);
              }
            }}
          >
            Login
          </button>
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
