
import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  UserCircle,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Leaf,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const username = user?.username || user?.name || "AgriTwin User";
  const role = user?.role || "User";

  const handleLogout = () => {
    localStorage.removeItem("agritwin_user");
    localStorage.removeItem("agritwin_token");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-4 py-3 sm:px-6 lg:px-8 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between gap-3">

        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 text-green-800 transition hover:bg-green-50 hover:text-green-600"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Leaf size={17} className="shrink-0 text-green-600" />
              <h2 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                Welcome to AgriTwin
              </h2>
            </div>

            <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
              Smart farming starts here
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="hidden items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-green-400 focus-within:bg-white md:flex md:w-48 lg:w-60">
            <Search size={18} className="shrink-0 text-gray-400" />

            <input
              type="text"
              placeholder="Search here..."
              className="w-full bg-transparent p-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative rounded-xl border border-orange-100 bg-orange-50 p-2.5 text-orange-500 transition hover:bg-orange-100"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              aria-expanded={showProfile}
              className={`flex items-center gap-2 rounded-xl p-1.5 transition ${
                showProfile ? "bg-green-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-lime-100 ring-2 ring-green-100">
                <UserCircle size={27} className="text-green-700" />
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-sm font-bold text-gray-800">
                  {username}
                </p>

                <p className="text-xs capitalize text-green-600">
                  {role}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-gray-500 transition-transform sm:block ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <>
                <button
                  aria-label="Close profile menu"
                  onClick={() => setShowProfile(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b border-gray-100 bg-green-50/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2 text-green-700">
                        <User size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-800">
                          {username}
                        </p>
                        <p className="text-xs capitalize text-green-600">
                          {role} Account
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600">
                      <ShieldCheck size={17} className="text-green-600" />
                      Account Information
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
