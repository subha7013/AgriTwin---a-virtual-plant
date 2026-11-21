
import {
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Activity,
  Wifi,
  WifiOff,
  Clock,
  TrendingUp,
  AlertTriangle,
  Radio,
  Sparkles,
  ArrowUpRight,
  Gauge,
} from "lucide-react";

function LiveMonitoring() {
  const sensors = [
    {
      title: "Soil Moisture",
      value: "65",
      unit: "%",
      status: "Optimal",
      icon: Droplets,
      color: "blue",
      description: "Soil water level",
      progress: 65,
    },
    {
      title: "Temperature",
      value: "28",
      unit: "°C",
      status: "Normal",
      icon: Thermometer,
      color: "orange",
      description: "Surrounding temperature",
      progress: 70,
    },
    {
      title: "Humidity",
      value: "72",
      unit: "%",
      status: "Good",
      icon: Wind,
      color: "cyan",
      description: "Air humidity level",
      progress: 72,
    },
    {
      title: "Light Intensity",
      value: "850",
      unit: "Lux",
      status: "Sufficient",
      icon: Sun,
      color: "yellow",
      description: "Available sunlight",
      progress: 80,
    },
  ];

  const history = [
    { time: "08 AM", moisture: 45, temperature: 24 },
    { time: "09 AM", moisture: 52, temperature: 25 },
    { time: "10 AM", moisture: 58, temperature: 26 },
    { time: "11 AM", moisture: 55, temperature: 27 },
    { time: "12 PM", moisture: 65, temperature: 28 },
    { time: "01 PM", moisture: 62, temperature: 29 },
    { time: "02 PM", moisture: 65, temperature: 28 },
  ];

  const colorClasses = {
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
              Live Monitoring
              <span className="block text-lime-300">
                Real-Time Plant Insights
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-green-50/85">
              Monitor soil moisture, temperature, humidity and sunlight
              conditions around your tomato plant from one dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold">
                <Activity size={17} />
                Demo Monitoring
              </span>

              <span className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold">
                <Radio size={17} />
                4 Parameters
              </span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="rounded-[26px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-green-100">
                    MONITORING OVERVIEW
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Plant Environment
                  </h2>
                </div>

                <div className="rounded-xl bg-lime-300/20 p-3 text-lime-200">
                  <Gauge size={27} />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <Droplets size={22} className="text-sky-200" />
                  <p className="mt-3 text-xs text-green-100">Soil Moisture</p>
                  <h3 className="mt-1 text-2xl font-bold">65%</h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <Thermometer size={22} className="text-orange-200" />
                  <p className="mt-3 text-xs text-green-100">Temperature</p>
                  <h3 className="mt-1 text-2xl font-bold">28°C</h3>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                <span className="text-sm text-green-50">
                  Monitoring interface
                </span>
                <span className="flex items-center gap-2 text-xs font-bold text-lime-200">
                  <span className="h-2 w-2 rounded-full bg-lime-300" />
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Overview */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Environmental Parameters
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Current sample readings from the plant environment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {sensors.map((sensor, index) => {
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

                    <h3 className="mt-2 text-3xl font-bold text-gray-800">
                      {sensor.value}
                      <span className="ml-1 text-lg font-semibold">
                        {sensor.unit}
                      </span>
                    </h3>
                  </div>

                  <div className={`rounded-xl p-3 ${colorClasses[sensor.color].icon}`}>
                    <Icon size={25} />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-gray-400">Level</span>
                    <span className="font-bold text-gray-700">
                      {sensor.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${colorClasses[sensor.color].bar}`}
                      style={{ width: `${sensor.progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">
                      {sensor.description}
                    </span>
                    <span className="text-xs font-semibold text-green-700">
                      {sensor.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sensor Connection */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Sensor Connection
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              IoT sensor connectivity overview
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-3 text-green-700">
            <Activity size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-xl bg-white p-3 text-green-700 shadow-sm">
                <Wifi size={22} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-gray-800">
                  Monitoring Interface
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Frontend available
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              Ready
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-xl bg-white p-3 text-orange-600 shadow-sm">
                <WifiOff size={22} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-gray-800">
                  ESP32 Connection
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Hardware integration pending
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              Offline
            </span>
          </div>
        </div>
      </section>

      {/* Monitoring History */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Monitoring History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sample environmental readings throughout the day
            </p>
          </div>

          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={17} />
            Last sample: 02:00 PM
          </span>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Soil Moisture (%)
          </span>

          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="h-3 w-3 rounded-full bg-orange-500" />
            Temperature (°C)
          </span>
        </div>

        <div className="space-y-5">
          {history.map((item, index) => (
            <div key={index}>
              <div className="mb-2 flex justify-between gap-3 text-xs text-gray-500">
                <span>{item.time}</span>
                <span>
                  {item.moisture}% moisture · {item.temperature}°C
                </span>
              </div>

              <div className="flex h-3 gap-2">
                <div className="flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${item.moisture}%` }}
                  />
                </div>

                <div className="flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${(item.temperature / 40) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monitoring Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-3 text-green-700 shadow-sm">
              <TrendingUp size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">
                Environmental Status
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Sample conditions are within expected ranges.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-3 text-orange-600 shadow-sm">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">
                Hardware Integration
              </h3>
              <p className="mt-1 text-sm text-orange-700">
                Connect ESP32 sensors to receive actual readings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-xs leading-6 text-amber-800">
          <strong>Demo Notice:</strong> All readings and monitoring history
          displayed here are sample demo values. Real-time sensor data will be
          available after ESP32 and backend integration.
        </p>
      </div>
    </div>
  );
}

export default LiveMonitoring;
