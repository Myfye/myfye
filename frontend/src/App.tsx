import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./AppRouter.tsx";
import Landing from "./pages/landing/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppRouter />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/eubgiaeubca" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
