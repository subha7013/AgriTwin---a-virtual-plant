
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
  ArrowUpRight,
  Filter,
  CircleCheck,
} from "lucide-react";

const initialAlerts = [
  {
    id: 1,
    title: "High Temperature Detected",
    message:
      "Temperature has reached 32°C. Monitor the tomato plants carefully.",
    type: "Critical",
    category: "Temperature",
    time: "10 minutes ago",
    icon: Thermometer,
    color: "text-red-600",
    bg: "bg-red-50",
    read: false,
    resolved: false,
  },
  {
    id: 2,
    title: "Low Soil Moisture",
    message:
      "Soil moisture is currently 35%. Check the irrigation requirements.",
    type: "Warning",
    category: "Soil Moisture",
    time: "30 minutes ago",
    icon: Droplets,
    color: "text-orange-600",
    bg: "bg-orange-50",
    read: false,
    resolved: false,
  },
  {
    id: 3,
    title: "High Humidity Warning",
    message:
      "Humidity is 82%. High humidity may encourage fungal disease development.",
    type: "Warning",
    category: "Humidity",
    time: "1 hour ago",
    icon: Cloud,
    color: "text-blue-600",
    bg: "bg-blue-50",
    read: true,
    resolved: false,
  },
  {
    id: 4,
    title: "Disease Risk Increased",
    message:
      "The demo risk assessment indicates an elevated disease risk.",
    type: "Critical",
    category: "Disease Risk",
    time: "2 hours ago",
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-50",
    read: false,
    resolved: false,
  },
  {
    id: 5,
    title: "Plant Health Reminder",
    message:
      "Regularly inspect tomato leaves for unusual spots and symptoms.",
    type: "Info",
    category: "Plant Health",
    time: "Yesterday",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50",
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
    if (filter === "Critical")
      return alert.type === "Critical" && !alert.resolved;
    if (filter === "Warning")
      return alert.type === "Warning" && !alert.resolved;
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

  const summaryCards = [
    {
      title: "Unread Alerts",
      value: unreadCount,
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Critical Alerts",
      value: criticalCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      title: "Warning Alerts",
      value: warningCount,
      icon: Info,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      title: "Resolved Alerts",
      value: resolvedCount,
      icon: CheckCircle,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
  ];

  return (
    <div className="space-y-7 pb-6">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-800 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-36 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-100">
              <Bell size={14} />
              ALERT CENTER
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Alerts & Notifications
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-green-100 sm:text-base">
              Stay informed about important warnings, environmental
              conditions and tomato plant health updates.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-xl bg-white/15 p-3">
              <Bell size={27} />
            </div>
            <div>
              <p className="text-xs text-green-100">UNREAD NOTIFICATIONS</p>
              <h2 className="mt-1 text-2xl font-bold">{unreadCount}</h2>
              <p className="text-xs text-green-100">Require your attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`group rounded-2xl border ${item.border} bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${item.bg} ${item.color}`}>
                  <Icon size={24} />
                </div>

                <ArrowUpRight
                  size={19}
                  className="text-gray-300 transition group-hover:text-green-600"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {item.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-800">
                {item.value}
              </h2>

              <p className={`mt-2 text-xs font-medium ${item.color}`}>
                {item.title === "Unread Alerts"
                  ? "Pending notifications"
                  : item.title === "Critical Alerts"
                  ? "Need attention"
                  : item.title === "Warning Alerts"
                  ? "Environmental warnings"
                  : "Successfully resolved"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <Bell size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Recent Notifications
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Review and manage your alerts.
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={17} />
            Mark All as Read
          </button>
        </div>

        {/* Filter */}
        <div className="mt-6 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <Filter size={17} className="text-green-700" />
            Filter Notifications
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-48"
          >
            <option value="All">All Alerts</option>
            <option value="Unread">Unread</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Alert List */}
        <div className="mt-5 space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const Icon = alert.icon;

              return (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-4 transition duration-200 hover:shadow-sm sm:p-5 ${
                    alert.resolved
                      ? "border-green-100 bg-green-50/40"
                      : !alert.read
                      ? "border-green-200 bg-green-50/30"
                      : "border-gray-100 bg-white hover:border-green-100"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row">

                    {/* Alert Icon */}
                    <div
                      className={`h-fit w-fit shrink-0 rounded-xl p-3 ${alert.bg} ${alert.color}`}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Alert Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-800 sm:text-base">
                          {alert.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            alert.type === "Critical"
                              ? "bg-red-50 text-red-700"
                              : alert.type === "Warning"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {alert.type}
                        </span>

                        {alert.resolved && (
                          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                            <CircleCheck size={13} />
                            Resolved
                          </span>
                        )}

                        {!alert.read && !alert.resolved && (
                          <span className="h-2 w-2 rounded-full bg-green-600" />
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {alert.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-500">
                          {alert.category}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {alert.time}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {!alert.read && !alert.resolved && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                          >
                            <Check size={14} />
                            Mark as Read
                          </button>
                        )}

                        {!alert.resolved && (
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-green-100 bg-white px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                          >
                            <CheckCircle size={14} />
                            Resolve Alert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="rounded-full bg-green-50 p-5 text-green-600">
                <CheckCircle size={36} />
              </div>

              <h3 className="mt-4 font-bold text-gray-800">
                No Alerts Found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                There are no notifications in this category. Try selecting
                another filter.
              </p>

              <button
                onClick={() => setFilter("All")}
                className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                View All Alerts
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-amber-700" />

        <div>
          <h3 className="text-sm font-bold text-amber-900">
            Demo Notifications
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">
            These are sample notifications for frontend demonstration.
            Actual alerts will require backend sensor data and integrated
            disease analysis.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Alerts;
