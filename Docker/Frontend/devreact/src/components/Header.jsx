export default function Header() {
  return (
    <header>
        <div>
            <img src="./5moviestransparent.png" className="logo" alt="logo"></img>
            <nav className="nav-items">
                <a href="#">Koti</a>
                <a href="#">Elokuvat</a>
                <a href="#">Sarjat</a>
                <a href="#">Kategoriat</a>
                <a href="#">Jotakin</a>
            </nav>
        </div>
        <div class="search-box">
            <input type="text" placeholder="Hae"></input>
        </div>
        <img src="https://flagsapi.com/FI/flat/64.png" class="flag" alt="Finland flag"></img>
    </header>
  )
}
