import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./AppRouter.tsx";
import LandingPage from "./pages/landing/LandingPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy.tsx";
import TermsOfService from "./pages/termsOfService/TermsOfService.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<AppRouter />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/tq73g9q9fa3hfw9fof0q9bf0dfvnbetw" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/terms-of-service" element={<TermsOfService/>} />
      </Routes>
    </Router>
  );
}

export default App;
