
import {
  useState,
} from "react";

import {
  ShieldAlert,
  Droplets,
  Thermometer,
  Cloud,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  Info,
} from "lucide-react";

function RiskPrediction() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");

  // Demo data only
  const riskScore = 68;

  const factors = [
    {
      name: "High Temperature",
      value: "32°C",
      risk: "High",
      icon: Thermometer,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      name: "Soil Moisture",
      value: "35%",
      risk: "Low",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "Humidity",
      value: "82%",
      risk: "High",
      icon: Cloud,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const riskHistory = [
    { day: "Mon", score: 35 },
    { day: "Tue", score: 42 },
    { day: "Wed", score: 50 },
    { day: "Thu", score: 45 },
    { day: "Fri", score: 58 },
    { day: "Sat", score: 62 },
    { day: "Sun", score: 68 },
  ];

  return (
    <div className="space-y-7">

      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Risk Prediction 📊
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor environmental conditions and estimated tomato plant disease risk.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <ShieldAlert size={24} />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
              High Risk
            </span>
          </div>

          <h3 className="text-gray-500 text-sm mt-4">
            Overall Disease Risk
          </h3>

          <p className="text-3xl font-bold text-gray-800 mt-1">
            68%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl w-fit">
            <Thermometer size={24} />
          </div>

          <h3 className="text-gray-500 text-sm mt-4">
            Temperature
          </h3>

          <p className="text-3xl font-bold text-gray-800 mt-1">
            32°C
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
            <Droplets size={24} />
          </div>

          <h3 className="text-gray-500 text-sm mt-4">
            Soil Moisture
          </h3>

          <p className="text-3xl font-bold text-gray-800 mt-1">
            35%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl w-fit">
            <Cloud size={24} />
          </div>

          <h3 className="text-gray-500 text-sm mt-4">
            Humidity
          </h3>

          <p className="text-3xl font-bold text-gray-800 mt-1">
            82%
          </p>
        </div>

      </div>

      {/* Risk Score and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Disease Risk Assessment
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Estimated risk level based on environmental conditions.
          </p>

          <div className="mt-8 flex flex-col items-center">

            <div className="relative w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#dc6b42 ${riskScore * 3.6}deg, #f3f4f6 0deg)`
              }}
            >
              <div className="w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">
                  {riskScore}%
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  Risk Score
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
                High Risk
              </span>

              <p className="text-sm text-gray-500 mt-4 max-w-sm">
                Environmental conditions indicate an elevated disease risk in this demo assessment.
              </p>
            </div>

          </div>

        </div>

        {/* Risk Factors */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

          <h2 className="text-xl font-bold text-gray-800">
            Environmental Risk Factors
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Environmental readings contributing to the demo assessment.
          </p>

          <div className="space-y-5 mt-6">

            {factors.map((factor, index) => {
              const Icon = factor.icon;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${factor.bg} ${factor.color}`}>
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {factor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {factor.value}
                      </p>
                    </div>
                  </div>

                  <span className={`text-sm font-bold ${
                    factor.risk === "High"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}>
                    {factor.risk}
                  </span>
                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* Risk History */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Risk History
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Demo risk score trend over the last seven days.
            </p>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>

        </div>

        <div className="mt-7 flex items-end justify-between gap-3 h-52 border-b border-gray-100 pb-2">

          {riskHistory.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">

              <span className="text-xs font-semibold text-gray-600">
                {item.score}%
              </span>

              <div
                className="w-full max-w-12 bg-green-600 rounded-t-lg hover:bg-green-700 transition"
                style={{ height: `${item.score}%` }}
              />

              <span className="text-xs text-gray-500">
                {item.day}
              </span>

            </div>
          ))}

        </div>

      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

        <h2 className="text-xl font-bold text-gray-800">
          Recommended Actions
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          General preventive suggestions for tomato plants.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

          <div className="flex gap-3 bg-green-50 p-4 rounded-xl">
            <CheckCircle className="text-green-700 shrink-0" size={22} />

            <div>
              <h3 className="font-semibold text-gray-800">
                Monitor Soil Moisture
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Check soil moisture regularly and maintain suitable irrigation.
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-orange-50 p-4 rounded-xl">
            <AlertTriangle className="text-orange-600 shrink-0" size={22} />

            <div>
              <h3 className="font-semibold text-gray-800">
                Inspect Tomato Leaves
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Regularly inspect leaves for unusual spots or visible symptoms.
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-blue-50 p-4 rounded-xl">
            <Droplets className="text-blue-600 shrink-0" size={22} />

            <div>
              <h3 className="font-semibold text-gray-800">
                Avoid Excess Water
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Avoid overwatering and provide proper drainage.
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-purple-50 p-4 rounded-xl">
            <Leaf className="text-purple-600 shrink-0" size={22} />

            <div>
              <h3 className="font-semibold text-gray-800">
                Maintain Plant Health
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Remove severely affected leaves and keep the growing area clean.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Demo Note */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
        <Info className="text-yellow-700 shrink-0 mt-0.5" size={20} />

        <p className="text-sm text-yellow-800">
          Demo data only. Actual disease risk prediction will require backend,
          environmental sensor data and AI model integration.
        </p>
      </div>

    </div>
  );
}

export default RiskPrediction;
