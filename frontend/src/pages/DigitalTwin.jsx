
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

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Digital Twin 🌱
        </h1>
        <p className="text-gray-500 mt-2">
          Virtual representation and monitoring of your tomato plant.
        </p>
      </div>

      {/* Plant Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Plant Visual */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Virtual Plant Model
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Digital view of your tomato plant
              </p>
            </div>

            <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-2 rounded-full">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Healthy
            </span>
          </div>

          <div className="bg-green-50 p-5 sm:p-8">

            <div className="bg-white rounded-2xl overflow-hidden">
              <img
                src="https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-healthy-plantvillage.webp"
                alt="Healthy tomato plant leaf"
                className="w-full h-64 sm:h-80 object-cover"
              />

              <div className="p-5 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Sprout size={22} />
                  <h3 className="text-xl font-bold">
                    {plantInfo.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Virtual Tomato Plant Representation
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Plant Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <h2 className="text-lg font-bold text-gray-800 mb-5">
            Plant Information
          </h2>

          <div className="space-y-5">

            <div>
              <p className="text-sm text-gray-500">Plant Name</p>
              <p className="font-semibold text-gray-800 mt-1">
                {plantInfo.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Plant Type</p>
              <p className="font-semibold text-gray-800 mt-1">
                {plantInfo.variety}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Growth Stage</p>
              <p className="font-semibold text-green-700 mt-1">
                {plantInfo.growthStage}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Plant Age</p>
              <p className="font-semibold text-gray-800 mt-1">
                {plantInfo.age}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Health Status</p>
              <span className="inline-flex items-center gap-2 mt-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                <HeartPulse size={17} />
                {plantInfo.health}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Monitoring</p>
              <p className="font-semibold text-gray-800 mt-1">
                Sensor integration pending
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Environmental Monitoring */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Environmental Monitoring
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Environmental parameters around the plant
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {sensorData.map((sensor, index) => {
            const Icon = sensor.icon;

            const colors = {
              blue: "bg-blue-100 text-blue-700",
              orange: "bg-orange-100 text-orange-700",
              cyan: "bg-cyan-100 text-cyan-700",
              yellow: "bg-yellow-100 text-yellow-700",
            };

            const bars = {
              blue: "bg-blue-500",
              orange: "bg-orange-500",
              cyan: "bg-cyan-500",
              yellow: "bg-yellow-500",
            };

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
                    <h3 className="text-2xl font-bold text-gray-800 mt-2">
                      {sensor.value}
                    </h3>
                  </div>

                  <div className={`p-3 rounded-xl ${colors[sensor.color]}`}>
                    <Icon size={25} />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bars[sensor.color]}`}
                      style={{ width: `${sensor.progress}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-green-700 font-semibold mt-3">
                    {sensor.status}
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* Growth Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
              <TrendingUp size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Plant Growth Progress
              </h2>
              <p className="text-sm text-gray-500">
                Current growth stage
              </p>
            </div>
          </div>

          <div className="space-y-5">

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Seedling Stage</span>
              <span className="text-green-700 font-semibold">Completed</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vegetative Stage</span>
              <span className="text-green-700 font-semibold">Current</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Flowering Stage</span>
              <span className="text-gray-400">Upcoming</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fruiting Stage</span>
              <span className="text-gray-400">Upcoming</span>
            </div>

          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-green-800 font-medium">
              Your tomato plant is currently in the vegetative growth stage.
            </p>
          </div>

        </div>

        {/* Monitoring Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Activity size={24} />
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

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Leaf className="text-green-700" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  Plant Model
                </span>
              </div>
              <span className="text-xs font-semibold text-green-700">
                Available
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Activity className="text-orange-600" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  IoT Sensors
                </span>
              </div>
              <span className="text-xs font-semibold text-orange-600">
                Pending
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  Live Updates
                </span>
              </div>
              <span className="text-xs font-semibold text-orange-600">
                Pending
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Demo Notice */}
      <p className="text-xs text-gray-400">
        Note: All environmental readings and plant growth information shown
        here are sample demo values. Real-time monitoring will be available
        after backend and IoT sensor integration.
      </p>

    </div>
  );
}

export default DigitalTwin;
