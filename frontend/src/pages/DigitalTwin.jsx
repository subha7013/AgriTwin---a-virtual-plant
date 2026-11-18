
import { Sprout, Thermometer, Droplets, Sun } from "lucide-react";

function DigitalTwin() {
  const plantData = [
    { label: "Temperature", value: "28°C", icon: Thermometer },
    { label: "Humidity", value: "65%", icon: Droplets },
    { label: "Light Intensity", value: "750 lux", icon: Sun },
    { label: "Plant Growth", value: "Healthy", icon: Sprout },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">
          Digital Twin 🌱
        </h1>
        <p className="text-gray-600 mt-2">
          Virtual representation of your tomato plant.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
        <h2 className="text-xl font-bold text-green-800 mb-5">
          Tomato Plant Model
        </h2>

        <div className="bg-green-50 rounded-xl p-10 flex flex-col items-center justify-center">
          <Sprout size={100} className="text-green-600" />
          <h3 className="text-xl font-semibold text-green-800 mt-4">
            Tomato Plant 1
          </h3>
          <span className="mt-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
            Healthy Plant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plantData.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white p-5 rounded-xl shadow-sm border border-green-100"
            >
              <Icon size={28} className="text-green-600 mb-4" />
              <p className="text-gray-500 text-sm">{item.label}</p>
              <h3 className="text-2xl font-bold text-green-800 mt-2">
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DigitalTwin;
