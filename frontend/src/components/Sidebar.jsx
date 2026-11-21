
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Sprout,
  Activity,
  Network,
  Leaf,
  Brain,
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
  { name: "Risk Prediction", path: "/risk-prediction", icon: BarChart3 },
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
      className={`fixed top-0 left-0 z-50 h-screen w-72 shrink-0 bg-gradient-to-b from-green-950 via-green-900 to-emerald-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:sticky lg:top-0 lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-lime-400 p-2 rounded-xl">
            <Sprout size={27} className="text-green-950" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              AgriTwin
            </h1>
            <p className="text-xs text-green-300">
              Smart Agriculture
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-white/10 rounded-lg"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation Heading */}
      <div className="px-5 pt-6 pb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-300">
          Main Menu
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 pb-5 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-lime-400 text-green-950 font-semibold shadow-lg"
                    : "text-green-100 hover:bg-white/10 hover:text-lime-300"
                }`
              }
            >
              <Icon size={19} />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={18} className="text-lime-400" />
            <p className="text-sm font-semibold">Grow Smarter</p>
          </div>

          <p className="text-xs text-green-200 leading-relaxed">
            Monitor your plants and manage crop health with AgriTwin.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 mt-3 text-red-300 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut size={19} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
