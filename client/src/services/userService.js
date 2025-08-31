import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getUser = async (userId, dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.status === 200) {
      dispatch({
        type: "SET_USER",
        payload: {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          createdRooms: response.data.createdRooms || [],
          joinedRooms: response.data.joinedRooms || [],
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

export const joinRoom = async (userId, roomCode, dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/room/join`,
      { userId: Number(userId), roomCode: String(roomCode) },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.status === 200) {
      await getUser(response.data.id, dispatch);
    }
    return response;
  } catch (error) {
    console.error("Join room error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Join room failed");
    }
    throw new Error("Join room failed");
  }
};
