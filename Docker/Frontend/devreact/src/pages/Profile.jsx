import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <main>
      <div class="container">

        <section class="profile-section">
          <div class="avatar"><img src="./ville.jpg"></img></div>
          <div class="profile-info">
            <h2>Rytkön Ville</h2>
            <p>@RytkönVille69 · Liittynyt: 12/2024 · Haapavesi, Suomi</p>
            <p>Elokuvaharrastaja. Kuuluisa sanoistaana "Sinut pittää nyt tappaa". Hirvidokkarit on parasta. Rakastaa kivääreitä ja 80-luvun kulttiklassikoita. </p>
          </div>
        </section>

        <h2 class="section-title">Omat ryhmät</h2>
        <div class="card-grid">
          <div class="card">5 Movies Testiryhmä</div>
          <div class="card">Ystäväporukan katselulista</div>
          <div class="card">Klassikkojen kerho</div>
        </div>

        <h2 class="section-title">Suosikkielokuvat</h2>
        <div class="movie-grid">
          <div class="movie-card">Terminator</div>
          <div class="movie-card">Star Wars</div>
          <div class="movie-card">Matrix</div>
          <div class="movie-card">Eraserhead</div>
        </div>

        <h2 class="section-title">Viimeisin aktiivisuus</h2>
        <ul class="activity-list">
          <li>Arvosteli: Star Wars (5/5)</li>
          <li>Liittyi ryhmään: Klassikkojen kerho</li>
          <li>Lisäsi suosikkeihin: Terminator</li>
          <li>Kommentoi ryhmässä: "Tää pitää nähdä uudestaan!"</li>
        </ul>

      </div>
    </main>
  )
}