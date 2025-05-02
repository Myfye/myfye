import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./pages/app/AppRouter.tsx";
import Landing from "./pages/landing/Landing.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppRouter />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
