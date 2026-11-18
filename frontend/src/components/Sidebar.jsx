
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Activity,
  Box,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Plant Details",
      path: "/plants",
      icon: Sprout,
    },
    {
      name: "Digital Twin",
      path: "/digital-twin",
      icon: Box,
    },
    {
      name: "Live Monitoring",
      path: "/live-monitoring",
      icon: Activity,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-green-100 p-5">
      <h2 className="text-lg font-bold text-green-800 mb-6">
        Main Menu
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-green-100 text-green-800 font-semibold"
                    : "text-gray-600 hover:bg-green-50"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
