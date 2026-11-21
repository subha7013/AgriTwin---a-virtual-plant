
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
  ArrowUpRight,
  CalendarDays,
  HeartPulse,
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
  const summaryCards = [
    {
      title: "Total Tomato Plants",
      value: "120",
      subtitle: "Demo plant records",
      icon: Sprout,
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-100",
    },
    {
      title: "Healthy Plants",
      value: "82",
      subtitle: "68.3% of total plants",
      icon: Leaf,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: "Diseased Plants",
      value: "38",
      subtitle: "31.7% of total plants",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    {
      title: "Average Plant Health",
      value: "78%",
      subtitle: "Demo health indicator",
      icon: HeartPulse,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  const environmentalData = [
    {
      title: "Temperature",
      value: "32°C",
      subtitle: "Sample reading",
      icon: Thermometer,
      trend: "Elevated",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      title: "Soil Moisture",
      value: "35%",
      subtitle: "Sample reading",
      icon: Droplets,
      trend: "Low Level",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      title: "Humidity",
      value: "82%",
      subtitle: "Sample reading",
      icon: Cloud,
      trend: "High Level",
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

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-100">
              <BarChart3 size={14} />
              AGRICULTURE INSIGHTS
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Analytics & Reports
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-green-100 sm:text-base">
              Analyze tomato plant health, disease distribution and
              environmental trends through visual insights.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-xl bg-white/15 p-3">
              <TrendingUp size={27} />
            </div>
            <div>
              <p className="text-xs text-green-100">PLANT HEALTH OVERVIEW</p>
              <h2 className="mt-1 text-2xl font-bold">78%</h2>
              <p className="text-xs text-green-100">Demo health indicator</p>
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
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Disease Distribution */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <PieChart size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Disease Distribution
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Percentage of detected disease categories
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
            <div
              className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#f97316 0% 28%, #ef4444 28% 50%, #eab308 50% 68%, #a855f7 68% 82%, #3b82f6 82% 100%)",
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span className="text-2xl font-bold text-gray-800">
                  100%
                </span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              {diseaseData.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-bold text-gray-800">
                      {item.value}%
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Health Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <BarChart3 size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Weekly Plant Health
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Healthy and diseased plant percentage
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5 text-xs">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="h-3 w-3 rounded-sm bg-green-600" />
              Healthy
            </span>

            <span className="flex items-center gap-2 text-gray-600">
              <span className="h-3 w-3 rounded-sm bg-red-400" />
              Diseased
            </span>
          </div>

          <div className="mt-7 space-y-5">
            {weeklyData.map((item) => (
              <div key={item.day}>
                <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {item.day}
                  </span>
                  <span className="text-right">
                    {item.healthy}% Healthy / {item.diseased}% Diseased
                  </span>
                </div>

                <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="bg-green-600 transition-all duration-500"
                    style={{ width: `${item.healthy}%` }}
                  />
                  <div
                    className="bg-red-400 transition-all duration-500"
                    style={{ width: `${item.diseased}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Trends */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-50 p-2 text-green-700">
                <Activity size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Environmental Trends
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Current sample environmental readings
            </p>
          </div>

          <span className="flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <Activity size={14} />
            Sample Readings
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {environmentalData.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`rounded-2xl border ${item.border} ${item.bg} p-5 transition duration-300 hover:-translate-y-1 hover:shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl bg-white p-3 ${item.color}`}>
                    <Icon size={24} />
                  </div>

                  <TrendingUp size={19} className={item.color} />
                </div>

                <p className="mt-5 text-sm font-medium text-gray-600">
                  {item.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold text-gray-800">
                  {item.value}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">
                    {item.subtitle}
                  </span>
                  <span className={`text-xs font-bold ${item.color}`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="shrink-0 rounded-xl bg-white p-3 text-green-700">
            <Leaf size={22} />
          </div>

          <div>
            <h3 className="font-bold text-gray-800">
              Plant Health Insight
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              82 out of 120 sample tomato plants are marked as healthy in
              the current dashboard data.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <div className="shrink-0 rounded-xl bg-white p-3 text-orange-600">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h3 className="font-bold text-gray-800">
              Disease Insight
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Early Blight has the highest share among the sample disease
              categories, accounting for 28%.
            </p>
          </div>
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
            All analytics values, disease percentages and charts are sample
            demo data. Real-time analytics will require backend, database
            and environmental sensor integration.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Analytics;
