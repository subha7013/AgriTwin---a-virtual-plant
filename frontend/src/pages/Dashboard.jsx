
import {
  Sprout,
  Leaf,
  Activity,
  AlertTriangle,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Plants",
      value: "120",
      change: "+12%",
      icon: Sprout,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Healthy Plants",
      value: "95",
      change: "+8%",
      icon: Leaf,
      color: "bg-lime-100 text-lime-700",
    },
    {
      title: "Diseased Plants",
      value: "25",
      change: "Needs attention",
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Active Sensors",
      value: "12",
      change: "All connected",
      icon: Activity,
      color: "bg-sky-100 text-sky-700",
    },
  ];

  const sensors = [
    {
      name: "Temperature",
      value: "28°C",
      icon: Thermometer,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      name: "Soil Moisture",
      value: "65%",
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      name: "Humidity",
      value: "72%",
      icon: Wind,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      name: "Sunlight",
      value: "850 lux",
      icon: Sun,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-7">

      {/* Welcome Section */}
      <div className="w-full min-w-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 rounded-none p-7 sm:p-9 text-white shadow-lg relative overflow-hidden">

        <div className="relative z-10">
          <p className="text-green-100 text-sm mb-2">
            Welcome to AgriTwin 🌱
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold">
            Smart Agriculture Dashboard
          </h1>

          <p className="text-green-100 mt-3 max-w-xl text-sm sm:text-base">
            Monitor your crops, track environmental conditions
            and manage plant health from one place.
          </p>

          <div className="flex items-center gap-2 mt-6 text-sm text-lime-200">
            <TrendingUp size={18} />
            <span>Growing smarter with technology</span>
          </div>
        </div>

        <Sprout
          size={170}
          className="absolute -right-5 -bottom-8 text-white/10"
        />
      </div>

      {/* Overview Cards */}
      <section className="w-full min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Overview
          </h2>

          <span className="text-xs text-gray-500">
            Demo Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full min-w-0">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="w-full min-w-0 overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-3 rounded-xl shrink-0 ${item.color}`}>
                    <Icon size={24} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-gray-400 shrink-0"
                  />
                </div>

                <p className="text-gray-500 text-sm mt-5 break-words">
                  {item.title}
                </p>

                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {item.value}
                </h3>

                <p className="text-xs text-gray-500 mt-2 break-words">
                  {item.change}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plant Health and Sensors */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full min-w-0">

        {/* Plant Health */}
        <div className="w-full min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Plant Health Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current crop health status
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  Healthy Plants
                </span>

                <span className="font-semibold text-green-700">
                  79%
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[79%] bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  Diseased Plants
                </span>

                <span className="font-semibold text-orange-600">
                  21%
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[21%] bg-orange-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-green-50 rounded-xl p-4 min-w-0">
              <p className="text-sm text-green-700">Healthy</p>
              <h3 className="text-2xl font-bold text-green-800 mt-1">
                95
              </h3>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 min-w-0">
              <p className="text-sm text-orange-700">
                Needs Attention
              </p>
              <h3 className="text-2xl font-bold text-orange-800 mt-1">
                25
              </h3>
            </div>
          </div>
        </div>

        {/* Sensor Readings */}
        <div className="w-full min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Environmental Monitoring
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Sample sensor readings
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {sensors.map((sensor) => {
              const Icon = sensor.icon;

              return (
                <div
                  key={sensor.name}
                  className={`${sensor.bg} rounded-xl p-4 min-w-0 overflow-hidden`}
                >
                  <Icon size={25} className={sensor.color} />

                  <p className="text-xs text-gray-600 mt-3">
                    {sensor.name}
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mt-1">
                    {sensor.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="w-full min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Recent Alerts
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Plant health notifications
            </p>
          </div>

          <AlertTriangle className="text-orange-500" size={24} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl">
            <div className="p-2 bg-orange-100 rounded-lg shrink-0">
              <AlertTriangle className="text-orange-600" size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                Disease detected
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Sample alert: Tomato plant requires attention.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Droplets className="text-blue-600" size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                Soil moisture update
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Sample alert: Soil moisture is being monitored.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
