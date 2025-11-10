import SimpleSlider from '../components/SimpleSlider'
import InTheatersSlider from '../components/InTheatersSlider'

export default function Home() {
  return (
    <main>
        <section class="slider">
            <SimpleSlider/>
        </section>

        <div class="container">
            <h2 class="section-title">Categories</h2>
            <div class="category-row">
                <div class="card"><img src="./scream.png"></img><span>HORROR</span></div>
                <div class="card"><img src="JimiKarri.jpg"></img><span>COMEDY</span></div>
                <div class="card"><img src="draamaLeo.jpg"></img><span>DRAMA</span></div>
                <div class="card"><img src="rambo.jpg"></img><span>ACTION</span></div>
            </div>
            
            <h2 class="section-title">Movies</h2>
            <div class="media-row">
                {/* <Link to="/info/1223601"><div class="card"><img src=""></img><span>Movie 1</span></div></Link> */}
                <div class="card"><img src=""></img><span>Movie 1</span></div>
                <div class="card"><img src=""></img><span>Movie 2</span></div>
                <div class="card"><img src=""></img><span>Movie 3</span></div>
                <div class="card"><img src=""></img><span>Movie 4</span></div>
            </div>
            
            <h2 class="section-title">Series</h2>
            <div class="media-row">
                <div class="card"><img src=""></img><span>Series 1</span></div>
                <div class="card"><img src=""></img><span>Series 2</span></div>
                <div class="card"><img src=""></img><span>Series 3</span></div>
                <div class="card"><img src=""></img><span>Series 4</span></div>
            </div>
        </div>
        
         <section class="slider">
            <InTheatersSlider />
        </section>

        
    </main>
  )
}
