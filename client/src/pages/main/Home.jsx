import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { PlusIcon } from "lucide-react";
import RoomCard from "../../components/RoomCard";
import { useState } from "react";
import JoinRoom from "../../components/JoinRoom";

export default function Home() {
  const user = useSelector((state) => state.user);
  const [joinRoom, setJoinRoom] = useState(false);
  console.log(user);

  const createdRooms = user.createdRooms || [];
  const joinedRooms = user.joinedRooms || [];

  const activeJoinedRooms = joinedRooms.filter(room => room.status !== "EXPIRED");
  const activeCreatedRooms = createdRooms.filter(room => room.status !== "EXPIRED");

  const allRooms = [...createdRooms, ...joinedRooms];

  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="w-screen flex flex-col h-screen">
      <Header />
      <div className="flex-1 bg-[var(--primary-color)]/5 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-600">My Rooms</h1>
            <p className="text-gray-600 text-sm">
              Manage your file sharing rooms
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gray-300 text-gray-700 font-semibold px-3 py-2 rounded-lg shadow"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
            <button onClick={() => {
              setJoinRoom(true)
            }} className="bg-[var(--blue-color)] flex gap-2 cursor-pointer text-white font-semibold px-3 py-2 rounded-lg shadow">
              <span>Join Room</span>
            </button>
            <button className="bg-[var(--primary-color)] flex gap-2 cursor-pointer text-white font-semibold px-3 py-2 rounded-lg shadow">
              <PlusIcon />
              <span>Create Room</span>
            </button>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Joined Rooms ({activeJoinedRooms.length})
          </h2>
          <div className="flex flex-wrap gap-4">
            {activeJoinedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Active Created Rooms ({activeCreatedRooms.length})
          </h2>
          <div className="flex flex-wrap gap-4">
            {activeCreatedRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        {showHistory && (
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Room History ({allRooms.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {allRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </section>
        )}
      </div>

      {
        joinRoom && (
          <JoinRoom />
        )
      }
    </div>
  );
}
