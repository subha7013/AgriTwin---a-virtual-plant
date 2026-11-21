
import { NavLink } from "react-router-dom";
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
  ChevronRight,
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
  const handleLogout = () => {
    localStorage.removeItem("agritwin_user");
    localStorage.removeItem("agritwin_token");
    window.location.href = "/login";
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0
        flex-col bg-gradient-to-b from-[#062d20] via-[#06452e] to-[#03291e]
        text-white shadow-2xl transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:sticky lg:top-0 lg:translate-x-0 lg:self-start
      `}
    >
      {/* Brand Section */}
      <div className="relative overflow-hidden border-b border-white/10 px-5 py-7">
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-lime-400/10 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-300 to-lime-500 shadow-lg shadow-lime-900/30">
              <Sprout size={29} className="text-green-950" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-wide">
                AgriTwin
              </h1>
              <p className="mt-0.5 text-xs tracking-wider text-green-300">
                SMART AGRICULTURE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-green-200 transition hover:bg-white/10 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>
      </div>

      {/* Navigation Heading */}
      <div className="flex items-center justify-between px-6 pb-4 pt-7">
        <p className="text-[11px] font-bold uppercase tracking-[2px] text-green-300/80">
          Main Menu
        </p>

        <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-green-200">
          {menuItems.length} ITEMS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-lime-300 to-lime-400 font-bold text-green-950 shadow-lg shadow-lime-950/20"
                    : "text-green-100 hover:translate-x-1 hover:bg-white/10 hover:text-lime-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="shrink-0"
                  />

                  <span className="flex-1 text-sm">
                    {item.name}
                  </span>

                  {isActive && (
                    <ChevronRight size={17} strokeWidth={2.5} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-4">

        {/* Grow Smarter Card */}
        <div className="relative overflow-hidden rounded-2xl border border-lime-300/15 bg-gradient-to-br from-green-700/80 to-emerald-900/80 p-4">
          <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-lime-300/10 blur-xl" />

          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-lime-300/15 p-2 text-lime-300">
                <Leaf size={19} />
              </div>

              <p className="text-sm font-bold text-white">
                Grow Smarter
              </p>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-green-100">
              Monitor your plants and manage crop health with AgriTwin.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-lime-300">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              Smart Farming Starts Here
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-red-400/15 px-4 py-3.5 text-red-300 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut size={19} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
