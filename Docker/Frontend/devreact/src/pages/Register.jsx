import { Link } from "react-router-dom";

export default function Register() {
  return (
    <main>
      <div className="login-wrapper">
        <h2>REGISTER</h2>
        <div className="login-box">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Verify Password" />
          <button>Sign Up</button>
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
            <img src="./ig.png" alt="Instagram" />
            <img src="./tiktok.png" alt="TikTok" />
            <img src="./yt.png" alt="YouTube" />
          </div>
        </div>

        <div className="info-card">
          <h3>DOWNLOAD APP</h3>
          <div className="qr">
            <img src="./qr.png" alt="QR" />
          </div>
        </div>
      </div>
    </main>
  );
}
