import { useState, useEffect, React } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import fetchPopular from "../utilities/fetchPopular";

function SimpleSlider() {
  const settings = {
    dots: false,
    lazyLoad: true,
    infinite: true,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const [populars, setPopulars] = useState([]);

  useEffect(() => {
    async function load() {
      const results = await fetchPopular();
      setPopulars(results);
      console.log(results);
    }

    load();
  }, []);

  return (
    <div class="theater-slider">
      <Slider {...settings}>
        {populars.map((object) => (
          <div class="slide">
            <h2>{object.title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/original${object.backdrop_path}`}
            ></img>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SimpleSlider;
