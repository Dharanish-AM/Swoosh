import { useSelector } from "react-redux";
import Header from "../../components/Header";
import {PlusIcon} from "lucide-react"
import RoomCard from "../../components/RoomCard";

export default function Home() {
  const user = useSelector((state) => state.user);

  const activeRooms = user.rooms?.filter((r) => r.status === "ACTIVE") || [];
  const expiredRooms = user.rooms?.filter((r) => r.status === "EXPIRED") || [];

  return (
    <div className="w-screen flex flex-col h-screen">
      <Header />
      <div className="flex-1 bg-[var(--primary-color)]/10  p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-600">My Rooms</h1>
            <p className="text-gray-600 text-sm">
              Manage your file sharing rooms
            </p>
          </div>
          <button className="bg-[var(--primary-color)] flex gap-2 cursor-pointer text-white font-semibold px-3 py-2 rounded-lg shadow">
            <PlusIcon />
            <span>Create Room</span>
          </button>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Active Rooms ({activeRooms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Expired Rooms ({expiredRooms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expiredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between opacity-70"
              >
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">
                    Room {room.roomCode}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created {new Date(room.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-red-500">Expired</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Expired
                  </span>
                  <button
                    className="bg-gray-300 text-gray-600 text-sm px-3 py-1 rounded cursor-not-allowed"
                    disabled
                  >
                    Expired
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
