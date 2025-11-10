import { Routes, Route, useParams } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Info from './pages/Info'
import Groups from './pages/Groups'

export default function App() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet"></link>

      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/info/:id" element={<Info />} />
        <Route path="/Groups" element={<Groups />} />
      
      </Routes>
      <Footer />

      <div id="kummeliPopup">
        <img src="https://media1.tenor.com/m/0sTpX4F98VAAAAAd/kummeli-mieti-rauhassa.gif"></img>
      </div>
    </>
  )
}
