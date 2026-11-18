
import {
  Thermometer,
  Droplets,
  Waves,
  Sun,
  Activity,
} from "lucide-react";

function LiveMonitoring() {
  const sensors = [
    {
      name: "Temperature",
      value: "28°C",
      status: "Normal",
      icon: Thermometer,
    },
    {
      name: "Humidity",
      value: "65%",
      status: "Normal",
      icon: Droplets,
    },
    {
      name: "Soil Moisture",
      value: "45%",
      status: "Normal",
      icon: Waves,
    },
    {
      name: "Light Intensity",
      value: "750 lux",
      status: "Normal",
      icon: Sun,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">
          Live Monitoring 📡
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor your plant environmental conditions.
        </p>
      </div>

      <div className="bg-green-100 border border-green-200 rounded-xl p-5 flex items-center gap-3">
        <Activity size={28} className="text-green-700" />

        <div>
          <h2 className="font-bold text-green-800">
            Sensor Monitoring Status
          </h2>
          <p className="text-sm text-green-700">
            Monitoring interface is ready.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;

          return (
            <div
              key={sensor.name}
              className="bg-white p-6 rounded-xl shadow-sm border border-green-100"
            >
              <Icon size={30} className="text-green-600 mb-5" />

              <h2 className="text-gray-600 font-medium">
                {sensor.name}
              </h2>

              <p className="text-3xl font-bold text-green-800 mt-3">
                {sensor.value}
              </p>

              <span className="inline-block mt-4 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {sensor.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LiveMonitoring;
