import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Sprout,
  Activity,
  Network,
  Leaf,
  Brain,
  Sliders,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Plants", path: "/plants", icon: Sprout },
  { name: "Plant Details", path: "/plant-details", icon: Leaf },
  { name: "Digital Twin", path: "/digital-twin", icon: Network },
  { name: "Live Monitoring", path: "/live-monitoring", icon: Activity },
  { name: "Disease Detection", path: "/disease-detection", icon: Brain },
  { name: "Risk Prediction", path: "/risk-prediction", icon: Sliders },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

function Sidebar({ isOpen = false, onClose }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen w-64 shrink-0 bg-gradient-to-b from-green-950 via-green-900 to-emerald-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:sticky lg:top-0 lg:translate-x-0`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-lime-400 p-2 rounded-xl text-green-950 shadow-md shrink-0">
            <Sprout size={22} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold tracking-wide text-white">
                AgriTwin
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-lime-300">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-green-300/80 font-medium">
              Precision Agriculture
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-green-200"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-green-300/60">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? "bg-lime-400 text-green-950 font-bold shadow-sm"
                    : "text-green-100/90 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer & Logout */}
      <div className="p-3 border-t border-white/10 shrink-0 space-y-2">
        <div className="bg-white/10 rounded-xl px-3 py-2 border border-white/10">
          <div className="flex items-center justify-between text-[11px] font-bold text-lime-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              Sensor Grid
            </span>
            <span className="text-green-200">Online</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-xl transition"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
