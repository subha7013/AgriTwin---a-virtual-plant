
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-green-700">
        AgriTwin 🌱
      </h1>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-gray-700">
          <UserCircle size={24} className="text-green-600" />

          <div>
            <p className="font-semibold text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "user"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
