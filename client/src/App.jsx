import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Home from "./pages/main/Home";

function App() {
  const isAuthenticated = true;
  return (
    <div>
      <Router>
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
