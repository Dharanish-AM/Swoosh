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
import { useEffect } from "react";
import { verifyToken } from "./services/authService";
import { getUser } from "./services/userService";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const checkToken = async () => {
        const response = await verifyToken(token, dispatch);
        if (response.status !== 200) {
          localStorage.removeItem("token");
          return false;
        }
        return true;
      };
      const runCheck = async () => {
        const valid = await checkToken();
        if (valid && userId) {
          await getUser(userId, dispatch);
        }
      };
      runCheck();
    }
  }, [dispatch, isAuthenticated, token, userId]);

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
