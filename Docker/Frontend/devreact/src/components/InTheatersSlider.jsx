import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function InTheatersSlider() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 12000, // Tee siirtymä pitkäksi ja pehmeäksi
    autoplaySpeed: 0, // Ei taukoa
    cssEase: "linear", // Tasainen liike
    pauseOnHover: false,
    pauseOnFocus: false,
    lazyLoad: true,
    arrows: false, // Piilota nuolet (jos ei tarvita)
    swipe: false, // Poistaa käsinpyyhkäisyn, estää “nykimisen”
  };
  return (
    <div class="theater-slider">
      <h2>NOW IN THEATERS</h2>
      <Slider {...settings}>
        <div class="slide">
          <img
            src="../public/harrypotter.jpg"
            style={{
              width: "100%",
              transform: "translateY(-200px) translateX(1px)",
            }}
          ></img>
        </div>
        <div class="slide">
          <img
            src="../public/interstellar.png"
            style={{
              width: "100%",
              transform: "translateY(-50px) translateX(1px)",
            }}
          ></img>
        </div>
        <div class="slide">
          <img
            src="../public/starwars.jpg"
            style={{
              width: "100%",
              transform: "translateY(-100px) translateX(1px)",
            }}
          ></img>
        </div>
      </Slider>
    </div>
  );
}

export default InTheatersSlider;
