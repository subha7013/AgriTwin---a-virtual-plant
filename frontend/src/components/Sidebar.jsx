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
  Sparkles,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Plants", path: "/plants", icon: Sprout },
  { name: "Plant Details", path: "/plant-details", icon: Leaf },
  { name: "Digital Twin", path: "/digital-twin", icon: Network, badge: "Twin" },
  { name: "Live Monitoring", path: "/live-monitoring", icon: Activity, badge: "IoT" },
  { name: "Disease Detection", path: "/disease-detection", icon: Brain, badge: "AI" },
  { name: "Risk Prediction", path: "/risk-prediction", icon: Sliders, badge: "ML" },
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
      {/* Logo & Brand */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-lime-400 p-2 rounded-xl shadow-md text-green-950">
            <Sprout size={24} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-wide text-white">
                AgriTwin
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white/10 text-lime-300 border border-white/10">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-green-300/80 font-medium">
              Cyber-Physical Twin AI
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden p-1.5 hover:bg-white/10 rounded-xl text-green-200 transition"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Heading */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-green-300/60">
          Navigation
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3.5 pb-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-lime-400 text-green-950 font-bold shadow-md shadow-lime-400/20"
                    : "text-green-100/90 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-xs sm:text-sm font-semibold">{item.name}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white/15 text-white/90">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-3.5 border-t border-white/10">
        <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold text-lime-300">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              Sensor Grid
            </span>
            <span className="text-[10px] text-green-200 font-semibold">Active</span>
          </div>
          <p className="text-[11px] text-green-200/80 leading-tight">
            Tomato Telemetry & Vision edge node operational.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 mt-2.5 text-xs font-bold text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
