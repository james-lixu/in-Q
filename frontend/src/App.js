import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import RegistrationForm from "./forms/RegistrationForm";
import LoginForm from "./forms/LoginForm";
import Messsages from "./pages/Messsages";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Games from "./pages/Games";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <div className="pages">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/:username" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/search" element={<Search />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/messages" element={<Messsages />} />
              <Route path="/games" element={<Games />} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
};

export default App;
