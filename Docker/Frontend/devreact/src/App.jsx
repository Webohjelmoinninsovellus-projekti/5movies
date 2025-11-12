import { useLayoutEffect } from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Movie from "./pages/Movie";
import Groups from "./pages/Groups";
import Series from "./pages/Series";
import Movies from "./pages/Movies";

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

export default function App() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Anton&display=swap"
        rel="stylesheet"
      ></link>

      <Header />
      <Wrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/series" element={<Series />} />
          <Route path="/movies" element={<Movies />} />
        </Routes>
      </Wrapper>
      <Footer />
    </>
  );
}
