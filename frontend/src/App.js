import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import RegistrationForm from "./components/RegistrationForm";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
