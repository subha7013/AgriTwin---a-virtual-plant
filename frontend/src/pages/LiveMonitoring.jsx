
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
      icon: "bg-blue-100 text-blue-700",
      bar: "bg-blue-500",
    },
    orange: {
      icon: "bg-orange-100 text-orange-700",
      bar: "bg-orange-500",
    },
    cyan: {
      icon: "bg-cyan-100 text-cyan-700",
      bar: "bg-cyan-500",
    },
    yellow: {
      icon: "bg-yellow-100 text-yellow-700",
      bar: "bg-yellow-500",
    },
  };

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Live Monitoring 📡
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor environmental conditions of your tomato plant.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">
          <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
          Demo Monitoring
        </div>
      </div>

      {/* Monitoring Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {sensors.map((sensor, index) => {
          const Icon = sensor.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {sensor.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {sensor.value}
                    <span className="text-lg ml-1">
                      {sensor.unit}
                    </span>
                  </h2>
                </div>

                <div className={`p-3 rounded-xl ${colorClasses[sensor.color].icon}`}>
                  <Icon size={25} />
                </div>
              </div>

              <div className="mt-5">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClasses[sensor.color].bar}`}
                    style={{ width: `${sensor.progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-3">
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

      {/* Sensor Connection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Sensor Connection
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              IoT sensor connectivity overview
            </p>
          </div>

          <Activity className="text-green-700" size={25} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <Wifi size={22} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Monitoring Interface
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Frontend available
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-green-700">
              Ready
            </span>
          </div>

          <div className="flex items-center justify-between bg-orange-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
                <WifiOff size={22} />
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  ESP32 Connection
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Hardware integration pending
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-orange-600">
              Offline
            </span>
          </div>

        </div>
      </div>

      {/* Monitoring History */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Monitoring History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sample environmental readings throughout the day
            </p>
          </div>

          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={17} />
            Last sample: 02:00 PM
          </span>
        </div>

        {/* Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[550px]">

            <div className="flex items-center gap-5 mb-5">
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Soil Moisture (%)
              </span>

              <span className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                Temperature (°C)
              </span>
            </div>

            <div className="space-y-5">

              {history.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{item.time}</span>
                    <span>
                      {item.moisture}% moisture · {item.temperature}°C
                    </span>
                  </div>

                  <div className="flex gap-2 h-3">
                    <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.moisture}%` }}
                      ></div>
                    </div>

                    <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(item.temperature / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>

      {/* Plant Monitoring Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
              <TrendingUp size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">
                Environmental Status
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Sample conditions are within expected ranges.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">
                Hardware Integration
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Connect ESP32 sensors to receive actual readings.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Demo Notice */}
      <p className="text-xs text-gray-400">
        Note: All readings and monitoring history displayed here are sample
        demo values. Real-time sensor data will be available after ESP32 and
        backend integration.
      </p>

    </div>
  );
}

export default LiveMonitoring;
