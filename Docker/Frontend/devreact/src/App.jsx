import { useLayoutEffect, lazy } from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";

const Snowfall = lazy(() => import("react-snowfall"));

import Header from "./components/Header";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Info = lazy(() => import("./pages/Info"));
const Groups = lazy(() => import("./pages/Groups"));
const Group = lazy(() => import("./pages/Group"));
const Series = lazy(() => import("./pages/Series"));
const Movies = lazy(() => import("./pages/Movies"));
const Footer = lazy(() => import("./components/Footer"));

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

      <Snowfall
        color="white"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
        snowflakeCount={75}
      />
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
