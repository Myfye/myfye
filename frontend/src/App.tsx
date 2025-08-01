import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./AppRouter.tsx";
import LandingPage from "./pages/landing/LandingPage.tsx";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy.tsx";
import TermsOfService from "./pages/termsOfService/TermsOfService.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<AppRouter />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/terms-of-service" element={<TermsOfService/>} />
      </Routes>
    </Router>
  );
}

export default App;
