import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./AppRouter.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import PrivacyPolicy from "./pages/privacy-policy/PrivacyPolicy.tsx";
import TermsOfService from "./pages/terms-of-service/TermsOfService.tsx";
import DeleteAccountPage from "./pages/account/DeleteAccount.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<AppRouter />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
