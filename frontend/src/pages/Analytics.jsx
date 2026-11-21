
import {
  Sprout,
  Leaf,
  AlertTriangle,
  Activity,
  TrendingUp,
  Droplets,
  Thermometer,
  Cloud,
  BarChart3,
  PieChart,
  Info,
} from "lucide-react";

const diseaseData = [
  { name: "Early Blight", value: 28, color: "bg-orange-500" },
  { name: "Late Blight", value: 22, color: "bg-red-500" },
  { name: "Bacterial Spot", value: 18, color: "bg-yellow-500" },
  { name: "Leaf Mold", value: 14, color: "bg-purple-500" },
  { name: "Other Diseases", value: 18, color: "bg-blue-500" },
];

const weeklyData = [
  { day: "Mon", healthy: 75, diseased: 25 },
  { day: "Tue", healthy: 80, diseased: 20 },
  { day: "Wed", healthy: 70, diseased: 30 },
  { day: "Thu", healthy: 85, diseased: 15 },
  { day: "Fri", healthy: 78, diseased: 22 },
  { day: "Sat", healthy: 88, diseased: 12 },
  { day: "Sun", healthy: 82, diseased: 18 },
];

function Analytics() {
  return (
    <div className="space-y-7">

      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Analytics & Reports 📊
        </h1>

        <p className="text-gray-500 mt-2">
          Analyze tomato plant health, disease distribution and environmental trends.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl w-fit">
            <Sprout size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Total Tomato Plants
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            120
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Demo plant records
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
            <Leaf size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Healthy Plants
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            82
          </h2>
          <p className="text-xs text-green-600 mt-2">
            68.3% of total plants
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl w-fit">
            <AlertTriangle size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Diseased Plants
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            38
          </h2>
          <p className="text-xs text-red-600 mt-2">
            31.7% of total plants
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit">
            <Activity size={24} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Average Plant Health
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            78%
          </h2>
          <p className="text-xs text-blue-600 mt-2">
            Demo health indicator
          </p>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Disease Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <PieChart size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Disease Distribution
              </h2>
              <p className="text-sm text-gray-500">
                Percentage of detected disease categories
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-7">

            <div
              className="w-44 h-44 rounded-full shrink-0"
              style={{
                background:
                  "conic-gradient(#f97316 0% 28%, #ef4444 28% 50%, #eab308 50% 68%, #a855f7 68% 82%, #3b82f6 82% 100%)",
              }}
            >
              <div className="w-28 h-28 bg-white rounded-full relative top-8 left-8 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">
                  100%
                </span>
                <span className="text-xs text-gray-500">
                  Total
                </span>
              </div>
            </div>

            <div className="w-full space-y-4">
              {diseaseData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {item.name}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {item.value}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Weekly Health Overview */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
              <BarChart3 size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Weekly Plant Health
              </h2>
              <p className="text-sm text-gray-500">
                Healthy and diseased plant percentage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 mt-6 text-xs">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-3 h-3 bg-green-600 rounded-sm" />
              Healthy
            </span>

            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-3 h-3 bg-red-400 rounded-sm" />
              Diseased
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {weeklyData.map((item) => (
              <div key={item.day}>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{item.day}</span>
                  <span>
                    {item.healthy}% Healthy / {item.diseased}% Diseased
                  </span>
                </div>

                <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="bg-green-600"
                    style={{ width: `${item.healthy}%` }}
                  />

                  <div
                    className="bg-red-400"
                    style={{ width: `${item.diseased}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Environmental Trends */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Environmental Trends
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Current sample environmental readings
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

          <div className="bg-orange-50 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <Thermometer className="text-orange-600" size={25} />
              <TrendingUp className="text-orange-500" size={20} />
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Temperature
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              32°C
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Sample reading
            </p>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <Droplets className="text-blue-600" size={25} />
              <Activity className="text-blue-500" size={20} />
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Soil Moisture
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              35%
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Sample reading
            </p>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl">
            <div className="flex justify-between items-center">
              <Cloud className="text-purple-600" size={25} />
              <Activity className="text-purple-500" size={20} />
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Humidity
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              82%
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Sample reading
            </p>
          </div>

        </div>

      </div>

      {/* Information Note */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
        <Info className="text-yellow-700 shrink-0 mt-0.5" size={20} />

        <p className="text-sm text-yellow-800">
          Note: All analytics values and charts are sample demo data.
          Real-time analytics will be available after backend and sensor integration.
        </p>
      </div>

    </div>
  );
}

export default Analytics;
