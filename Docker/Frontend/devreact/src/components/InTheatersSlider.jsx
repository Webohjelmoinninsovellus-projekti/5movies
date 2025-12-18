/*import { useState, useEffect, React } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { inTheatersData } from "../utilities/inTheatersData";

function InTheatersSlider() {
  const settings = {
    dots: false, // Piilottaa pienet navigointipisteet (dot-indikaattorit)
    infinite: true, // Mahdollistaa jatkuvan silmukan (karuselli ei lopu)
    slidesToShow: 1, // Näytetään yksi dia kerrallaan
    slidesToScroll: 1, // Siirretään yksi dia kerrallaan
    autoplay: true, // Käynnistää automaattisen liikkeen
    speed: 12000, // Siirtymän (animaation) kesto millisekunneissa – hidas ja pehmeä liike
    autoplaySpeed: 0, // Ei taukoa liikkeiden välissä (jatkuva liike)
    cssEase: "linear", // Tasainen nopeus koko animaation ajan (ei kiihdytystä tai hidastusta)
    pauseOnHover: false, // Ei pysäytä liikkumista, vaikka hiiri viedään karusellin päälle
    pauseOnFocus: false, // Ei pysäytä liikkumista, vaikka elementti saa fokuksen (esim. tabilla)
    lazyLoad: true, // Lataa kuvat vasta, kun niitä tarvitaan (parantaa suorituskykyä)
    arrows: false, // Piilottaa seuraava/edellinen-nuolinäppäimet
    swipe: false, // Poistaa kosketus- ja hiiripyyhkäisyn (estää nykimistä ja manuaalisen liikkeen)
  };

  const [inTheaters, setInTheater] = useState([]);

  useEffect(() => {
    async function load() {
      const results = await inTheatersData();
      setInTheater(results);
    }

    load();
  }, []);

  return (
    <div className="theater-slider">
      <Slider {...settings}>
        {inTheaters.map((item) => (
          <div className="slide">
            <Link to={`/movie/${item.id}`} reloadDocument={true}>
              <h2>{item.title}</h2>
              <img
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
              ></img>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default InTheatersSlider;*/
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { inTheatersData } from "../utilities/tmdbFetcher";
import "../styles/InTheatersSlider.css";
import LoadingElement from "../components/LoadingElement";

function InTheatersSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = await inTheatersData();
      setMovies(results);
    }
    load();
  }, []);

  return (
    <div className="marquee">
      <div className="marquee-content">
        {movies.concat(movies).map((item, index) => (
          <Link
            key={index}
            to={`/movie/${item.id}`}
            reloadDocument={true}
            className="marquee-item"
          >
            <img
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              alt={item.title}
              loading="lazy"
            />
            <h2>{item.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default InTheatersSlider;
