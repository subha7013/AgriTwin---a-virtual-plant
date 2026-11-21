
import {
  Sprout,
  Leaf,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Activity,
  CalendarDays,
  TrendingUp,
  HeartPulse,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function DigitalTwin() {
  const plantInfo = {
    name: "Tomato Plant - 01",
    variety: "Tomato",
    growthStage: "Vegetative Stage",
    age: "35 Days",
    health: "Healthy",
  };

  const sensorData = [
    {
      title: "Soil Moisture",
      value: "65%",
      status: "Optimal",
      icon: Droplets,
      color: "blue",
      progress: 65,
    },
    {
      title: "Temperature",
      value: "28°C",
      status: "Normal",
      icon: Thermometer,
      color: "orange",
      progress: 70,
    },
    {
      title: "Humidity",
      value: "72%",
      status: "Good",
      icon: Wind,
      color: "cyan",
      progress: 72,
    },
    {
      title: "Sunlight",
      value: "8 Hours",
      status: "Sufficient",
      icon: Sun,
      color: "yellow",
      progress: 80,
    },
  ];

  const colors = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      bar: "bg-blue-500",
    },
    orange: {
      icon: "bg-orange-50 text-orange-600",
      bar: "bg-orange-500",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-600",
      bar: "bg-cyan-500",
    },
    yellow: {
      icon: "bg-amber-50 text-amber-600",
      bar: "bg-amber-500",
    },
  };

  const growthStages = [
    { name: "Seedling Stage", status: "Completed" },
    { name: "Vegetative Stage", status: "Current" },
    { name: "Flowering Stage", status: "Upcoming" },
    { name: "Fruiting Stage", status: "Upcoming" },
  ];

  return (
    <div className="w-full min-w-0 space-y-7">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#123D2B] via-[#17613B] to-[#27834B] p-6 sm:p-8 lg:p-10 text-white shadow-lg">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-[-90px] right-1/3 h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-lime-100">
              <Sparkles size={15} />
              SMART AGRICULTURE SYSTEM
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight">
              Digital Twin
              <span className="block text-lime-300">
                Plant Intelligence
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-green-50/85">
              Monitor your tomato plant through its virtual representation.
              Track environmental conditions, growth progress and plant health
              from one smart dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold">
                <HeartPulse size={17} />
                {plantInfo.health}
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold">
                <CalendarDays size={17} />
                {plantInfo.age}
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-[26px] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
              <img
                src="https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-healthy-plantvillage.webp"
                alt="Healthy tomato plant"
                className="h-56 sm:h-64 w-full rounded-[20px] object-cover"
              />

              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-xs text-green-100">
                    ACTIVE PLANT MODEL
                  </p>

                  <h3 className="mt-1 font-bold">
                    {plantInfo.name}
                  </h3>
                </div>

                <div className="shrink-0 rounded-xl bg-lime-300/20 p-3 text-lime-200">
                  <Sprout size={25} />
                </div>
              </div>
            </div>

            {/* Fixed Plant Healthy Badge */}
            <div className="mt-4 w-fit rounded-xl border border-green-100/20 bg-white px-4 py-3 text-green-800 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck size={17} />
                Plant Healthy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plant Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Plant Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Virtual plant information and current condition
          </p>
        </div>

        <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
          Model Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Plant Name",
            value: plantInfo.name,
            icon: Leaf,
          },
          {
            label: "Plant Type",
            value: plantInfo.variety,
            icon: Sprout,
          },
          {
            label: "Growth Stage",
            value: plantInfo.growthStage,
            icon: TrendingUp,
          },
          {
            label: "Plant Age",
            value: plantInfo.age,
            icon: CalendarDays,
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-green-50 p-3 text-green-700">
                  <Icon size={21} />
                </div>

                <ArrowUpRight size={17} className="text-gray-300" />
              </div>

              <p className="mt-4 text-xs font-medium text-gray-500">
                {item.label}
              </p>

              <h3 className="mt-1 text-base font-bold text-gray-800">
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Environmental Monitoring */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Environmental Monitoring
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Environmental parameters around your tomato plant
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {sensorData.map((sensor, index) => {
            const Icon = sensor.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {sensor.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-gray-800">
                      {sensor.value}
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${colors[sensor.color].icon}`}>
                    <Icon size={24} />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Level</span>

                    <span className="font-bold text-gray-700">
                      {sensor.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${colors[sensor.color].bar}`}
                      style={{ width: `${sensor.progress}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-green-700">
                    {sensor.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Growth and System Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Growth Timeline */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <TrendingUp size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Plant Growth Progress
              </h2>

              <p className="text-sm text-gray-500">
                Tomato plant development stages
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {growthStages.map((stage, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    stage.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : stage.status === "Current"
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {stage.status === "Completed" ? "✓" : index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {stage.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {stage.status}
                  </p>
                </div>

                {stage.status === "Current" && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-green-50 p-4">
            <p className="text-sm leading-6 text-green-800">
              Your tomato plant is currently in the vegetative growth stage.
            </p>
          </div>
        </section>

        {/* Digital Twin Status */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Activity size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Digital Twin Status
              </h2>

              <p className="text-sm text-gray-500">
                System integration overview
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Plant Model",
                description: "Virtual plant representation",
                status: "Available",
                icon: Leaf,
                active: true,
              },
              {
                name: "IoT Sensors",
                description: "Environmental sensor connection",
                status: "Pending",
                icon: Activity,
                active: false,
              },
              {
                name: "Live Updates",
                description: "Real-time monitoring",
                status: "Pending",
                icon: CalendarDays,
                active: false,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-white p-2 text-green-700 shadow-sm">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm leading-6 text-blue-800">
              The plant model is available. IoT sensor integration and live
              updates are currently pending.
            </p>
          </div>
        </section>
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-xs leading-6 text-amber-800">
          <strong>Demo Notice:</strong> All environmental readings and plant
          growth information shown here are sample demo values. Real-time
          monitoring will be available after backend and IoT sensor integration.
        </p>
      </div>

    </div>
  );
}

export default DigitalTwin;
