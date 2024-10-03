import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import RegistrationForm from "./components/RegistrationForm";
import Messsages from "./pages/Messsages";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Games from "./pages/Games";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messsages />} />
            <Route path="/games" element={<Games />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
