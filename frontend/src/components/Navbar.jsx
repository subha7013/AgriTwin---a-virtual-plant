
import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-4">

      <div className="flex items-center justify-between gap-4">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-green-50 text-green-800"
          >
            <Menu size={24} />
          </button>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Welcome to AgriTwin 🌱
            </h2>

            <p className="hidden sm:block text-xs text-gray-500">
              Smart farming starts here
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 w-56">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search here..."
              className="w-full bg-transparent outline-none p-2 text-sm"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition">
            <Bell size={21} />

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-green-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <UserCircle size={27} className="text-green-700" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.username || user?.name || "AgriTwin User"}
                </p>

                <p className="text-xs text-green-600 capitalize">
                  {user?.role || "User"}
                </p>
              </div>

              <ChevronDown size={16} className="hidden sm:block text-gray-500" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-3">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.username || user?.name || "AgriTwin User"}
                </p>

                <p className="text-xs text-gray-500 capitalize mt-1">
                  {user?.role || "User"} Account
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
