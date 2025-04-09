import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import AppRouter from "./pages/app/AppRouter temp.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppRouter />} />
      </Routes>
    </Router>
  );
}

export default App;
