import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { Merge, PlusIcon } from "lucide-react";
import RoomCard from "../../components/RoomCard";
import { useState } from "react";
import CreateRoom from "../../components/CreateRoom";
import JoinRoom from "../../components/JoinRoom";

export default function Home() {
  const user = useSelector((state) => state.user);
  const [joinRoom, setJoinRoom] = useState(false);
  const [createRoom, setCreateRoom] = useState(false);
  console.log(user);

  const createdRooms = user.createdRooms || [];
  const joinedRooms = user.joinedRooms || [];

  const activeJoinedRooms = joinedRooms.filter(
    (room) => room.status !== "EXPIRED"
  );
  const activeCreatedRooms = createdRooms.filter(
    (room) => room.status !== "EXPIRED"
  );

  const expiredRooms = [...createdRooms, ...joinedRooms].filter(
    (room) => room.status === "EXPIRED" && user.id === room.sender.id
  );

  return (
    <div className="w-screen flex flex-col h-screen bg-[var(--primary-color)]/5">
      <Header />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
              My Rooms
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your file sharing rooms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setJoinRoom(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 transition text-white font-medium px-4 py-2 rounded-lg shadow-sm text-sm"
            >
              <Merge size={16} />
              <span>Join Room</span>
            </button>
            <button
              onClick={() => setCreateRoom(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 transition text-white font-medium px-4 py-2 rounded-lg shadow-sm text-sm"
            >
              <PlusIcon size={16} />
              <span>Create Room</span>
            </button>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Active Created Rooms ({activeCreatedRooms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCreatedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Active Joined Rooms ({activeJoinedRooms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeJoinedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Expired Rooms ({expiredRooms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {expiredRooms.map((room, index) => (
              <RoomCard key={`${room.id}-${index}`} room={room} />
            ))}
          </div>
        </section>
      </div>

      {joinRoom && <JoinRoom onClose={() => setJoinRoom(false)} />}
      {createRoom && <CreateRoom onClose={() => setCreateRoom(false)} />}
    </div>
  );
}
