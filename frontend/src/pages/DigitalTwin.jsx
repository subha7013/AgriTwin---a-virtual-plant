import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { getPlants } from "../services/plantService";

function DigitalTwin() {
  const [plants, setPlants] = useState([]);
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlants() {
      try {
        const data = await getPlants();
        if (data && data.plants && data.plants.length > 0) {
          setPlants(data.plants);
        }
      } catch {
        // Continue with default
      } finally {
        setLoading(false);
      }
    }
    loadPlants();
  }, []);

  const activePlant = plants[selectedPlantIndex] || {
    name: "Greenhouse Tomato Plant #01",
    variety: "Roma VF",
    growthStage: "vegetative",
    plantedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    health: "healthy",
  };

  const ageDays = Math.max(
    1,
    Math.round((Date.now() - new Date(activePlant.plantedAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  const isHealthy = activePlant.health === "healthy";
  const isDiseased = activePlant.health === "diseased";

  const sensorData = [
    {
      title: "Soil Moisture",
      value: "64%",
      status: "Optimal",
      icon: Droplets,
      color: "blue",
      progress: 64,
    },
    {
      title: "Ambient Temperature",
      value: "25.5°C",
      status: "Optimal Range",
      icon: Thermometer,
      color: "orange",
      progress: 68,
    },
    {
      title: "Relative Humidity",
      value: "68%",
      status: "Safe (Low Spore Risk)",
      icon: Wind,
      color: "cyan",
      progress: 68,
    },
    {
      title: "Daily Photoperiod",
      value: "9.5 Hours",
      status: "Healthy Sunlight",
      icon: Sun,
      color: "yellow",
      progress: 80,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Sprout size={24} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              Crop Digital Twin
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">
            Real-time cyber-physical twin model representing physiological state and sensor telemetry.
          </p>
        </div>

        {/* Plant Switcher if multiple plants exist */}
        {plants.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Twin Target:</span>
            <select
              value={selectedPlantIndex}
              onChange={(e) => setSelectedPlantIndex(Number(e.target.value))}
              className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {plants.map((p, idx) => (
                <option key={p._id} value={idx}>
                  🌱 {p.name} ({p.health})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Plant Visual */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">
                Virtual Crop Mesh & Physiological Twin
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Reflecting latest vision diagnosis and environmental history
              </p>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                isHealthy
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : isDiseased
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isHealthy ? "bg-emerald-600" : isDiseased ? "bg-red-600" : "bg-gray-400"
                }`}
              />
              {activePlant.health.toUpperCase()}
            </span>
          </div>

          <div className="bg-gradient-to-b from-green-50/50 to-emerald-50/30 p-5 sm:p-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
              <img
                src={
                  isDiseased
                    ? "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-early-blight-plantvillage.webp"
                    : "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-healthy-plantvillage.webp"
                }
                alt="Digital twin representation"
                className="w-full h-64 sm:h-80 object-cover"
              />

              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-green-800">
                    <Sprout size={20} />
                    <h3 className="text-lg font-bold">{activePlant.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Twin Model: Solanum lycopersicum · Age: {ageDays} Days
                  </p>
                </div>

                <Link
                  to="/disease-detection"
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  <ScanSearch size={15} />
                  Diagnose with AI
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Plant Metadata Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-800 border-b pb-3">
            Physiological Attributes
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider">Crop Identity</p>
              <p className="font-bold text-gray-800 text-sm mt-0.5">{activePlant.name}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider">Cultivar / Variety</p>
              <p className="font-bold text-gray-700 mt-0.5">{activePlant.variety || "Standard Tomato"}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider">Phenological Stage</p>
              <p className="font-bold text-green-700 capitalize mt-0.5">{activePlant.growthStage} Stage</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider">Crop Chronological Age</p>
              <p className="font-bold text-gray-700 mt-0.5">{ageDays} Days Post-Germination</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider">AI Pathological State</p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold ${
                    isHealthy
                      ? "bg-emerald-100 text-emerald-800"
                      : isDiseased
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <HeartPulse size={15} />
                  {activePlant.health === "healthy"
                    ? "Asymptomatic (Healthy)"
                    : activePlant.health === "diseased"
                    ? "Pathogen Symptoms Flagged"
                    : "Awaiting Vision Scan"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/disease-detection"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition"
              >
                Scan This Plant
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Telemetry Sensors */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Microclimatic Telemetry
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Calibrated sensor feeds monitoring canopy and root-zone conditions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <p className="text-xs font-semibold text-gray-400">{sensor.title}</p>
                    <h3 className="text-2xl font-black text-gray-800 mt-1">{sensor.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${colors[sensor.color]}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bars[sensor.color]}`}
                      style={{ width: `${sensor.progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-green-700 font-bold mt-2.5 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {sensor.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DigitalTwin;
