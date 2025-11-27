import { useLayoutEffect } from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Info from "./pages/Info";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
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
      <div className="page-wrapper">
        <Wrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/movie/:id" element={<Info />} />
            <Route path="/tv/:id" element={<Info />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group/:name" element={<Group />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
          </Routes>
        </Wrapper>
      </div>
      <Footer />
    </>
  );
}
