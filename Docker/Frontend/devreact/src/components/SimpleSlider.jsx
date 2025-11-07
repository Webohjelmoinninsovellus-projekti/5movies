import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };
  return (
    <div class="slider">
        <h2>SUOSITELLUT ELOKUVAT</h2>
    <Slider {...settings}>
        <div class="slide">
            <img src="../public/harrypotter.jpg" style={{
            width: "100%",
            transform: "translateY(-200px) translateX(0px)",
    }}></img>
        </div>
        <div class="slide">
            <img src="../public/interstellar.png" style={{
            width: "100%",
            transform: "translateY(-50px) translateX(0px)",
    }}></img>
        </div>
        <div class="slide">
            <img src="../public/starwars.jpg" style={{
            width: "100%",
            transform: "translateY(-50px) translateX(0px)",
    }}></img>
        </div>
    </Slider>
    </div>
  );
}

export default SimpleSlider;
