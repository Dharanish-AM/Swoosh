import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getUser = async (userId, dispatch) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.status === 200) {
      dispatch({
        type: "SET_USER",
        payload: {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          rooms: response.data.rooms || [],
          registeredAt: response.data.registeredAt,
        },
      });
      return response;
    }
  } catch (error) {
    console.error("Get user error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Get user failed");
    }
    throw error;
  }
};