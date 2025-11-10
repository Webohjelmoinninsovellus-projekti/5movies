import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header>
        <div>
            <Link to="/"><img src="./5moviestransparent.png" className="logo" alt="logo"></img></Link>
            <nav className="nav-items">
                <Link to="/">Home</Link>
                <a href="/">Movies</a>
                <a href="/">Series</a>
                <a href="/">Categories</a>
                <Link to="/Groups">Groups</Link>
            </nav>
        </div>
        <div class="search-box">
            <input type="text" placeholder="Search"></input>
            <Link to="/login"><img class="user-icon" src="./user.png"></img></Link>
        </div>
    </header>
  )
}
