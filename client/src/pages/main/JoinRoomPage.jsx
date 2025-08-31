import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { joinRoom } from "../../services/userService";
import { BounceLoader } from "react-spinners";

const JoinRoomPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const [joined, setJoined] = useState(false); // prevent multiple joins

  useEffect(() => {
    if (!roomCode || !userId || joined) return;
    const handleJoinRoom = async () => {
      try {
        const response = await joinRoom(userId, roomCode, dispatch);
        if (response.status === 200) {
          toast.success("Joined room successfully!");
          setJoined(true);
          navigate(`/room/${response.data.id}`);
        }
      } catch (error) {
        toast.error(error.message);
        navigate("/");
      }
    };

    handleJoinRoom();
  }, [roomCode, userId, navigate, dispatch, joined]);

  return (
    <div className="flex w-screen justify-center items-center h-screen">
      <BounceLoader color="#36d7b7" />
    </div>
  );
};

export default JoinRoomPage;
