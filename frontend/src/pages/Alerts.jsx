
import { useState } from "react";

import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Thermometer,
  Droplets,
  Cloud,
  Leaf,
  Check,
  Clock,
  ShieldAlert,
} from "lucide-react";

const initialAlerts = [
  {
    id: 1,
    title: "High Temperature Detected",
    message: "Temperature has reached 32°C. Monitor the tomato plants carefully.",
    type: "Critical",
    category: "Temperature",
    time: "10 minutes ago",
    icon: Thermometer,
    color: "text-red-600",
    bg: "bg-red-100",
    read: false,
    resolved: false,
  },
  {
    id: 2,
    title: "Low Soil Moisture",
    message: "Soil moisture is currently 35%. Check the irrigation requirements.",
    type: "Warning",
    category: "Soil Moisture",
    time: "30 minutes ago",
    icon: Droplets,
    color: "text-orange-600",
    bg: "bg-orange-100",
    read: false,
    resolved: false,
  },
  {
    id: 3,
    title: "High Humidity Warning",
    message: "Humidity is 82%. High humidity may encourage fungal disease development.",
    type: "Warning",
    category: "Humidity",
    time: "1 hour ago",
    icon: Cloud,
    color: "text-blue-600",
    bg: "bg-blue-100",
    read: true,
    resolved: false,
  },
  {
    id: 4,
    title: "Disease Risk Increased",
    message: "The demo risk assessment indicates an elevated disease risk.",
    type: "Critical",
    category: "Disease Risk",
    time: "2 hours ago",
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-100",
    read: false,
    resolved: false,
  },
  {
    id: 5,
    title: "Plant Health Reminder",
    message: "Regularly inspect tomato leaves for unusual spots and symptoms.",
    type: "Info",
    category: "Plant Health",
    time: "Yesterday",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-100",
    read: true,
    resolved: true,
  },
];

function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState("All");

  const unreadCount = alerts.filter(
    (alert) => !alert.read && !alert.resolved
  ).length;

  const criticalCount = alerts.filter(
    (alert) => alert.type === "Critical" && !alert.resolved
  ).length;

  const warningCount = alerts.filter(
    (alert) => alert.type === "Warning" && !alert.resolved
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.resolved
  ).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !alert.read && !alert.resolved;
    if (filter === "Critical") return alert.type === "Critical" && !alert.resolved;
    if (filter === "Warning") return alert.type === "Warning" && !alert.resolved;
    if (filter === "Resolved") return alert.resolved;

    return true;
  });

  const markAsRead = (id) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const resolveAlert = (id) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id
          ? { ...alert, resolved: true, read: true }
          : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts((previous) =>
      previous.map((alert) => ({ ...alert, read: true }))
    );
  };

  return (
    <div className="space-y-7">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Alerts & Notifications 🔔
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor important warnings and updates about your tomato plants.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-3 rounded-xl font-semibold text-sm"
        >
          <Check size={18} />
          Mark All as Read
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit">
            <Bell size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Unread Alerts
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            {unreadCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl w-fit">
            <AlertTriangle size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Critical Alerts
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            {criticalCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl w-fit">
            <Info size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Warning Alerts
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            {warningCount}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl w-fit">
            <CheckCircle size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Resolved Alerts
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            {resolvedCount}
          </h2>
        </div>

      </div>

      {/* Alert List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Recent Notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Review and manage your alerts.
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Alerts</option>
            <option value="Unread">Unread</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Resolved">Resolved</option>
          </select>

        </div>

        <div className="space-y-4 mt-6">

          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const Icon = alert.icon;

              return (
                <div
                  key={alert.id}
                  className={`border rounded-2xl p-4 sm:p-5 transition ${
                    alert.resolved
                      ? "border-green-100 bg-green-50/40"
                      : !alert.read
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-100 bg-white"
                  }`}
                >

                  <div className="flex flex-col sm:flex-row gap-4">

                    <div className={`p-3 rounded-xl w-fit h-fit ${alert.bg} ${alert.color}`}>
                      <Icon size={24} />
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold text-gray-800">
                          {alert.title}
                        </h3>

                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          alert.type === "Critical"
                            ? "bg-red-100 text-red-700"
                            : alert.type === "Warning"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {alert.type}
                        </span>

                        {alert.resolved && (
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                            Resolved
                          </span>
                        )}

                        {!alert.read && !alert.resolved && (
                          <span className="w-2 h-2 bg-green-600 rounded-full" />
                        )}

                      </div>

                      <p className="text-sm text-gray-600 mt-2 leading-6">
                        {alert.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>{alert.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {alert.time}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">

                        {!alert.read && !alert.resolved && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                          >
                            Mark as Read
                          </button>
                        )}

                        {!alert.resolved && (
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="text-sm font-semibold text-green-700 hover:text-green-900 flex items-center gap-1"
                          >
                            <CheckCircle size={15} />
                            Resolve
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <CheckCircle size={40} className="text-green-500 mx-auto" />

              <h3 className="font-semibold text-gray-700 mt-4">
                No Alerts Found
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                There are no notifications in this category.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Demo Note */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
        <Info className="text-yellow-700 shrink-0 mt-0.5" size={20} />

        <p className="text-sm text-yellow-800">
          Note: These are sample notifications for frontend demonstration.
          Real alerts will be generated from backend sensor data and AI analysis.
        </p>
      </div>

    </div>
  );
}

export default Alerts;
