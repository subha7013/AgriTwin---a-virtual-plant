
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
  ShieldCheck,
  BarChart3,
  Sparkles,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Plants",
      value: "120",
      change: "+12%",
      subtitle: "Compared to last month",
      icon: Sprout,
      color: "bg-emerald-50 text-emerald-700",
      accent: "from-emerald-500 to-green-400",
    },
    {
      title: "Healthy Plants",
      value: "95",
      change: "+8%",
      subtitle: "Growing healthy",
      icon: Leaf,
      color: "bg-lime-50 text-lime-700",
      accent: "from-lime-500 to-emerald-400",
    },
    {
      title: "Diseased Plants",
      value: "25",
      change: "Attention",
      subtitle: "Affected plants",
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-600",
      accent: "from-orange-500 to-amber-400",
    },
    {
      title: "Active Sensors",
      value: "12",
      change: "Connected",
      subtitle: "Monitoring devices",
      icon: Activity,
      color: "bg-sky-50 text-sky-700",
      accent: "from-sky-500 to-cyan-400",
    },
  ];

  const sensors = [
    {
      name: "Temperature",
      value: "28°C",
      icon: Thermometer,
      color: "text-orange-500",
      bg: "bg-orange-50",
      status: "Normal",
      level: "70%",
      bar: "bg-orange-400",
    },
    {
      name: "Soil Moisture",
      value: "65%",
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-50",
      status: "Good",
      level: "65%",
      bar: "bg-blue-500",
    },
    {
      name: "Humidity",
      value: "72%",
      icon: Wind,
      color: "text-purple-500",
      bg: "bg-purple-50",
      status: "Normal",
      level: "72%",
      bar: "bg-purple-500",
    },
    {
      name: "Sunlight",
      value: "850 lux",
      icon: Sun,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      status: "Good",
      level: "85%",
      bar: "bg-yellow-400",
    },
  ];

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 sm:space-y-8 pb-6 overflow-x-clip">

      {/* Welcome Banner */}
      <section className="relative isolate overflow-hidden rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-[#073b2b] via-[#086044] to-[#159568] px-5 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-11 text-white shadow-xl shadow-green-950/10">

        <div className="absolute -right-20 -top-24 h-64 w-64 sm:h-80 sm:w-80 rounded-full border-[25px] sm:border-[35px] border-white/[0.06]" />
        <div className="absolute -bottom-32 right-10 sm:right-32 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="absolute right-8 top-8 hidden opacity-[0.08] lg:block">
          <Sprout size={210} strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 sm:mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold tracking-wide text-lime-100 backdrop-blur-md">
            <Sparkles size={15} className="shrink-0" />
            SMART AGRICULTURE PLATFORM
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight">
            Welcome to AgriTwin
          </h1>

          <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-6 sm:leading-7 text-green-50/85">
            Your smart farming command center. Monitor crop health,
            understand environmental conditions and make better
            farming decisions.
          </p>

          <div className="mt-5 sm:mt-7 flex flex-col xs:flex-row flex-wrap items-start gap-3">
            <div className="w-full xs:w-auto inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs sm:text-sm font-medium backdrop-blur-md">
              <TrendingUp size={18} className="shrink-0 text-lime-300" />
              Growing smarter with technology
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-xs sm:text-sm font-bold text-green-950">
              <Leaf size={17} />
              AgriTwin Overview
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="min-w-0">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-6 w-1 shrink-0 rounded-full bg-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">
                Dashboard Overview
              </h2>
            </div>

            <p className="ml-3 text-xs sm:text-sm text-gray-500">
              Your farm performance at a glance
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Sample Data
          </span>
        </div>

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/[0.06]"
              >
                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${item.accent}`} />

                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl p-3 sm:p-3.5 ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={23} strokeWidth={1.9} />
                  </div>

                  <div className="rounded-full bg-gray-50 p-2 text-gray-300 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <p className="mt-4 sm:mt-5 text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800">
                    {item.value}
                  </h3>

                  <span className={`mb-1 rounded-lg px-2.5 py-1 text-[10px] sm:text-[11px] font-bold ${
                    item.title === "Diseased Plants"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {item.change}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plant Health and Environment */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 min-w-0">

        {/* Plant Health */}
        <div className="min-w-0 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 lg:p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <ShieldCheck size={23} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-800">
                  Plant Health
                </h2>
                <p className="text-xs text-gray-500 sm:text-sm">
                  Current crop health status
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              Overview
            </span>
          </div>

          <div className="mt-7 sm:mt-8 flex flex-col items-center gap-7 sm:flex-row sm:justify-around">
            <div className="relative flex h-40 w-40 sm:h-44 sm:w-44 shrink-0 items-center justify-center">
              <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="66"
                  fill="none"
                  stroke="#f1f5f2"
                  strokeWidth="13"
                />

                <circle
                  cx="80"
                  cy="80"
                  r="66"
                  fill="none"
                  stroke="#16a36a"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeDasharray="414.7"
                  strokeDashoffset="87"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800">
                  79%
                </span>
                <span className="mt-1 text-xs font-medium text-gray-400">
                  Healthy plants
                </span>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                    Healthy
                  </div>
                  <span className="font-bold text-gray-800">95</span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[79%] rounded-full bg-emerald-500" />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  79% of total plants
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-400" />
                    Needs attention
                  </div>
                  <span className="font-bold text-gray-800">25</span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-[21%] rounded-full bg-orange-400" />
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  21% of total plants
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3.5">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Leaf size={17} className="shrink-0" />
                  <span className="text-sm font-semibold">
                    Crop health summary
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                  Most plants are currently marked as healthy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Monitoring */}
        <div className="min-w-0 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 lg:p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-2xl bg-sky-50 p-3 text-sky-700">
                <BarChart3 size={23} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-800">
                  Environmental Monitoring
                </h2>
                <p className="text-xs text-gray-500 sm:text-sm">
                  Sample environmental readings
                </p>
              </div>
            </div>

            <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              4 Metrics
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
            {sensors.map((sensor) => {
              const Icon = sensor.icon;

              return (
                <div
                  key={sensor.name}
                  className="min-w-0 rounded-2xl border border-gray-100 bg-[#fcfdfc] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className={`rounded-xl p-3 ${sensor.bg}`}>
                      <Icon size={21} className={sensor.color} />
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {sensor.status}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-medium text-gray-500">
                    {sensor.name}
                  </p>

                  <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-gray-800 break-words">
                    {sensor.value}
                  </h3>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${sensor.bar}`}
                      style={{ width: sensor.level }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Note */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 sm:px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
            <Sprout size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-900">
              Smarter farming starts here
            </p>
            <p className="mt-0.5 text-xs leading-5 text-emerald-700/80">
              AgriTwin helps you keep track of your plant environment.
            </p>
          </div>
        </div>

        <ChevronRight size={19} className="shrink-0 text-emerald-600" />
      </div>

    </div>
  );
}

export default Dashboard;
