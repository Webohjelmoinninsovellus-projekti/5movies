import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

import { login, register } from "../utilities/userManager.js";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { loadUser } = useContext(AuthContext);
  const lostAudio = new Audio("/sounds/public_sounds_lost.wav");
  const wonAudio = new Audio("/sounds/public_sounds_won.wav");
  lostAudio.volume = 0.3;
  wonAudio.volume = 0.3;
  return (
    <main>
      <div className="login-wrapper">
        <h2>REGISTER</h2>
        <div className="login-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Verify Password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
          <div className="login-extra">
            Password must be at least 8 characters long, contain at least one
            uppercase letter and one number.
          </div>
          <br />
          <button
            onClick={async () => {
              setMessage("");

              const usernameRegex = /^[a-zA-Z0-9]{1,30}$/;
              const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;

              if (!usernameRegex.test(username)) {
                setMessage("Username can only contain letters and numbers");
                return;
              }

              if (
                password === verifyPassword &&
                password.length >= 8 &&
                passwordRegex.test(password)
              ) {
                const result = await register(username, password);
                console.log(result);

                switch (result.status) {
                  case 201:
                    const data = await login(username, password);

                    if (data) {
                      setMessage("Registration successful!");
                      await loadUser();
                      confetti();
                      wonAudio.play();
                      navigate("/profile/" + username);
                    }

                    break;
                  case 409:
                    setMessage("Username already in use.");

                    break;
                }
              } else {
                lostAudio.play();
                setMessage(
                  "Password must be at least 8 characters long and contain atleast one uppercase and one number."
                );
              }
            }}
          >
            Sign Up
          </button>

          <p>{message}</p>
        </div>
      </div>

      <div className="login-extra">
        Do you already have an account?
        <br />
        <Link to="/login">Log in</Link>
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
