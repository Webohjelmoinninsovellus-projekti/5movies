import { useState, useEffect, React } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchPopular } from "../utilities/tmdbFetcher";
import LoadingElement from "../components/LoadingElement";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const results = await fetchPopular();
      setPopulars(results);
      console.log(results);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div class="theater-slider">
      {loading && <LoadingElement />}
      <Slider {...settings}>
        {populars.map((item) => (
          <div class="slide">
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

export default SimpleSlider;
