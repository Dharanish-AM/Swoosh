import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      dispatch({
        type: "SET_AUTH",
        isAuthenticated: true,
        token: response.data.token,
        userId: response.data.userId,
      });
      return response;
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed");
    }
    throw error;
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Signup error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Signup failed");
    }
    throw error;
  }
};

export const verifyToken = async (token, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      dispatch({
        type: "SET_AUTH",
        isAuthenticated: true,
        token: token,
        userId: response.data.id,
      });
      return response;
    }
  } catch (error) {
    console.error("Token verification error:", error);
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Token verification failed"
      );
    }
    throw error;
  }
};
