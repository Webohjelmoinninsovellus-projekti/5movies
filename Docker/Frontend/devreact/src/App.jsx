import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import SimpleSlider from './components/SimpleSlider'

function App() {
  return (
    <>
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet"></link>

        <Header />

        <section class="slider">
            <SimpleSlider/>
        </section>

        <div class="container">
            <h2 class="section-title">Kategoriat</h2>
            <div class="category-row">
                <div class="card"><img src="./scream.png"></img><span>KAUHU</span></div>
                <div class="card"><img src="JimiKarri.jpg"></img><span>KOMEDIA</span></div>
                <div class="card"><img src="draamaLeo.jpg"></img><span>DRAAMA</span></div>
                <div class="card"><img src="rambo.jpg"></img><span>TOIMINTA</span></div>
            </div>
            
            <h2 class="section-title">Elokuvat</h2>
            <div class="media-row">
                <div class="card"><img src=""></img><span>Elokuva 1</span></div>
                <div class="card"><img src=""></img><span>Elokuva 2</span></div>
                <div class="card"><img src=""></img><span>Elokuva 3</span></div>
                <div class="card"><img src=""></img><span>Elokuva 4</span></div>
            </div>
            
            <h2 class="section-title">Sarjat</h2>
            <div class="media-row">
                <div class="card"><img src=""></img><span>Sarja 1</span></div>
                <div class="card"><img src=""></img><span>Sarja 2</span></div>
                <div class="card"><img src=""></img><span>Sarja 3</span></div>
                <div class="card"><img src=""></img><span>Sarja 4</span></div>
            </div>

        </div>
        
        <Footer></Footer>

        <div id="kummeliPopup"><img src="https://media1.tenor.com/m/0sTpX4F98VAAAAAd/kummeli-mieti-rauhassa.gif"></img></div>
    </>
  )
}

export default App
