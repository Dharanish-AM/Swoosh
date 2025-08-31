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
      await getUser(userId, dispatch);
    }
    return response;
  } catch (error) {
    const message = error.response?.data || "Join room failed";
    console.log(message);
    throw new Error(message);
  }
};

export const createRoom = async (userId, roomData, dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/room`, roomData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.status === 201 || response.status === 200) {
      await getUser(userId, dispatch);
    }
    console.log(response);
    return response;
  } catch (error) {
    console.error("Create room error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Create room failed");
    }
    throw new Error("Create room failed");
  }
};

export const deleteRoom = async (userId, roomId, dispatch) => {
  try {
    const response = await axios.delete(
      `${API_URL}/room?userId=${userId}&roomId=${roomId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.status === 200) {
      await getUser(userId, dispatch);
    }
    return response;
  } catch (error) {
    console.error("Delete room error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Delete room failed");
    }
    throw new Error("Delete room failed");
  }
};

export const sendFile = async (userId, roomId, file, dispatch) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/file?senderId=${userId}&roomId=${roomId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      await getUser(userId, dispatch);
    }
    return response;
  } catch (error) {
    console.error("Send file error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Send file failed");
    }
    throw new Error("Send file failed");
  }
};

export const removeFile = async (userId, roomId, fileId, dispatch) => {
  try {
    const response = await axios.delete(
      `${API_URL}/file/${userId}/${roomId}/${fileId}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.status === 200) {
      await getUser(userId, dispatch);
    }
    return response;
  } catch (error) {
    console.error("Remove file error:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Remove file failed");
    }
    throw new Error("Remove file failed");
  }
};
