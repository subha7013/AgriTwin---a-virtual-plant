import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  UserCircle,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.username || "AgriTwin User";
  const displayRole = user?.role || "Operator";
  const displayEmail = user?.email || "user@agritwin.local";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-green-50 text-green-800 transition focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
                AgriTwin Control Center
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Twin
              </span>
            </div>
            <p className="hidden md:block text-xs text-gray-500">
              Cyber-physical tomato monitoring & deep learning diagnostics
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Quick Search */}
          <div className="hidden md:flex items-center bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 w-48 lg:w-60 focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600 transition">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search diseases, plants..."
              className="w-full bg-transparent outline-none p-2 text-xs text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Notifications */}
          <Link
            to="/alerts"
            className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 border border-gray-200/60 transition"
            title="System Alerts"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200/80 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-700 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  {displayRole}
                </p>
              </div>

              <ChevronDown size={14} className="hidden sm:block text-gray-400 transition" />
            </button>

            {/* Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 top-13 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50 rounded-xl mb-1">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {displayEmail}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      {displayRole}
                    </span>
                    <span className="text-[10px] text-gray-400">Authenticated</span>
                  </div>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                >
                  <Settings size={15} />
                  Account Settings
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;
