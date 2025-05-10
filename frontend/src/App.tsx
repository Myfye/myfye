import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./AppRouter.tsx";
import LandingPage from "./pages/landing/LandingPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<AppRouter />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/tq73g9q" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
