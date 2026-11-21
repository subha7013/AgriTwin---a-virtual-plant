
import { useState } from "react";
import {
  ShieldAlert,
  Droplets,
  Thermometer,
  Cloud,
  Leaf,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Info,
  Activity,
  ArrowUpRight,
  Sprout,
  CalendarDays,
} from "lucide-react";

function RiskPrediction() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days");

  // Demo data only
  const riskScore = 68;

  const factors = [
    {
      name: "High Temperature",
      value: "32°C",
      risk: "High",
      icon: Thermometer,
      color: "text-orange-600",
      bg: "bg-orange-50",
      bar: "bg-orange-500",
      level: 85,
    },
    {
      name: "Soil Moisture",
      value: "35%",
      risk: "Low",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-50",
      bar: "bg-blue-500",
      level: 35,
    },
    {
      name: "Humidity",
      value: "82%",
      risk: "High",
      icon: Cloud,
      color: "text-purple-600",
      bg: "bg-purple-50",
      bar: "bg-purple-500",
      level: 82,
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

  const historyData =
    selectedPeriod === "Today"
      ? [{ day: "Today", score: 68 }]
      : selectedPeriod === "Last 30 Days"
      ? [
          { day: "Week 1", score: 30 },
          { day: "Week 2", score: 38 },
          { day: "Week 3", score: 55 },
          { day: "Week 4", score: 68 },
        ]
      : riskHistory;

  const recommendations = [
    {
      title: "Monitor Soil Moisture",
      description:
        "Check soil moisture regularly and maintain suitable irrigation.",
      icon: CheckCircle,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "Inspect Tomato Leaves",
      description:
        "Regularly inspect leaves for unusual spots or visible symptoms.",
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      title: "Avoid Excess Water",
      description:
        "Avoid overwatering and provide proper drainage.",
      icon: Droplets,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Maintain Plant Health",
      description:
        "Remove severely affected leaves and keep the growing area clean.",
      icon: Leaf,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
  ];

  return (
    <div className="space-y-7 pb-6">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-950 via-green-800 to-emerald-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-36 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-100">
              <Activity size={14} />
              ENVIRONMENTAL RISK ANALYSIS
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Risk Prediction
            </h1>

            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-green-100">
              Monitor environmental conditions and estimated tomato plant
              disease risk to support better crop management.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-xl bg-white/15 p-3">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="text-xs text-green-100">CURRENT RISK LEVEL</p>
              <p className="mt-1 text-xl font-bold">High Risk</p>
              <p className="text-xs text-green-100">Demo assessment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <ShieldAlert size={24} />
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              High Risk
            </span>
          </div>
          <p className="mt-5 text-sm font-medium text-gray-500">
            Overall Disease Risk
          </p>
          <div className="mt-1 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-gray-800">68%</h2>
            <span className="text-xs font-semibold text-red-500">
              Elevated
            </span>
          </div>
        </div>

        <div className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="w-fit rounded-xl bg-orange-50 p-3 text-orange-600">
            <Thermometer size={24} />
          </div>
          <p className="mt-5 text-sm font-medium text-gray-500">
            Temperature
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-800">32°C</h2>
          <p className="mt-1 text-xs text-orange-600">High temperature</p>
        </div>

        <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600">
            <Droplets size={24} />
          </div>
          <p className="mt-5 text-sm font-medium text-gray-500">
            Soil Moisture
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-800">35%</h2>
          <p className="mt-1 text-xs text-blue-600">Low moisture level</p>
        </div>

        <div className="group rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="w-fit rounded-xl bg-purple-50 p-3 text-purple-600">
            <Cloud size={24} />
          </div>
          <p className="mt-5 text-sm font-medium text-gray-500">
            Humidity
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-800">82%</h2>
          <p className="mt-1 text-xs text-purple-600">High humidity</p>
        </div>

      </div>

      {/* Risk Assessment and Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Risk Score */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Disease Risk Assessment
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Estimated risk based on environmental conditions.
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <Activity size={22} />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div
              className="relative flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#dc6b42 ${riskScore * 3.6}deg, #edf2ee 0deg)`,
              }}
            >
              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span className="text-4xl font-bold text-gray-800">
                  {riskScore}%
                </span>
                <span className="mt-1 text-sm font-medium text-gray-500">
                  Risk Score
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                <AlertTriangle size={16} />
                High Risk
              </span>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
                Environmental conditions indicate an elevated disease risk
                in this demo assessment.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-800">
              <Info size={17} />
              Assessment Information
            </div>
            <p className="mt-2 text-xs leading-relaxed text-green-700">
              This score is sample data for interface demonstration and
              is not a verified disease prediction.
            </p>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Environmental Risk Factors
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Environmental readings in the demo assessment.
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="mt-7 space-y-7">
            {factors.map((factor, index) => {
              const Icon = factor.icon;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`rounded-xl p-3 ${factor.bg} ${factor.color}`}>
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-gray-800">
                          {factor.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {factor.value}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        factor.risk === "High"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {factor.risk} Risk
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${factor.bar}`}
                      style={{ width: `${factor.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border border-orange-100 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-orange-600" />
              <div>
                <h3 className="text-sm font-bold text-orange-800">
                  Environmental Alert
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-orange-700">
                  High temperature and humidity are marked as risk factors
                  in this sample assessment.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Risk History */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Risk History
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Demo risk score trend over the selected period.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <CalendarDays size={17} className="text-green-700" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex h-56 items-end justify-between gap-2 border-b border-gray-100 pb-2 sm:gap-4">
          {historyData.map((item, index) => (
            <div
              key={index}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-bold text-gray-600">
                {item.score}%
              </span>

              <div className="flex h-full w-full items-end justify-center">
                <div
                  className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${
                    item.score >= 60
                      ? "bg-gradient-to-t from-orange-600 to-orange-400"
                      : "bg-gradient-to-t from-green-700 to-green-500"
                  }`}
                  style={{ height: `${item.score}%` }}
                />
              </div>

              <span className="whitespace-nowrap text-[10px] font-medium text-gray-500 sm:text-xs">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
            Lower Risk
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Higher Risk
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <Sprout size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Recommended Actions
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              General preventive suggestions for tomato plants.
            </p>
          </div>
          <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            Plant Care Tips
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {recommendations.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`flex gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm ${item.bg} ${item.border}`}
              >
                <div className={`h-fit rounded-lg bg-white p-2 ${item.color}`}>
                  <Icon size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-amber-700" />
        <div>
          <h3 className="text-sm font-bold text-amber-900">
            Demo Data Notice
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">
            The displayed readings and risk scores are sample data only.
            Actual disease risk prediction will require backend integration,
            environmental sensor data and a trained prediction model.
          </p>
        </div>
      </div>

    </div>
  );
}

export default RiskPrediction;
