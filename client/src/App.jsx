import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Home from "./pages/main/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { verifyToken } from "./services/authService";
import { getUser } from "./services/userService";
import Room from "./pages/main/Room";
import {PacmanLoader}  from "react-spinners";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runCheck = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await verifyToken(token, dispatch);
        if (response.status !== 200) {
          throw new Error("Token invalid or expired");
        }
        if (userId) {
          await getUser(userId, dispatch);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    runCheck();
  }, [dispatch, token, userId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <PacmanLoader size={40} speed={1.5} color="var(--primary-color)" />
      </div>
    );
  }

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
            <Route path="/room/:id" element={<Room />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
