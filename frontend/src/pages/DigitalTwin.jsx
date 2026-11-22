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
  ChevronRight,
  Eye,
  Layers,
  Sparkles
} from "lucide-react";
import { getPlants } from "../services/plantService";

function DigitalTwin() {
  const [plants, setPlants] = useState([]);
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const [viewMode, setViewMode] = useState("vector"); // 'vector' | 'photo'
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlants() {
      try {
        const data = await getPlants();
        if (data && data.plants && data.plants.length > 0) {
          setPlants(data.plants);
        }
      } catch {
        // Continue with default showcase plant
      } finally {
        setLoading(false);
      }
    }
    loadPlants();
  }, []);

  const activePlant = plants[selectedPlantIndex] || {
    name: "Greenhouse Tomato Plant #01",
    variety: "Roma VF (Indeterminate)",
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
      value: "64.0%",
      status: "Adequate Root Hydration",
      icon: Droplets,
      color: "blue",
      progress: 64,
    },
    {
      title: "Canopy Temperature",
      value: "25.5°C",
      status: "Optimal Growth Range",
      icon: Thermometer,
      color: "orange",
      progress: 68,
    },
    {
      title: "Relative Humidity",
      value: "68.0%",
      status: "Safe Transpiration Margin",
      icon: Wind,
      color: "cyan",
      progress: 68,
    },
    {
      title: "Photoperiod Exposure",
      value: "9.5 Hours",
      status: "Balanced Sunlight",
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
            <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shadow-xs">
              <Sprout size={24} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Crop Cyber-Physical Digital Twin
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Dynamic virtual representation tracking physiological age, foliage vigor, and root-zone telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Plant Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Model Mode Toggle */}
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setViewMode("vector")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "vector"
                  ? "bg-green-700 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Layers size={14} />
              Virtual Plant Model
            </button>
            <button
              onClick={() => {
                setViewMode("photo");
                setImageError(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "photo"
                  ? "bg-green-700 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Eye size={14} />
              Reference Photo
            </button>
          </div>

          {plants.length > 1 && (
            <select
              value={selectedPlantIndex}
              onChange={(e) => setSelectedPlantIndex(Number(e.target.value))}
              className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {plants.map((p, idx) => (
                <option key={p._id} value={idx}>
                  🌱 {p.name} ({p.health})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid: Visual Twin & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Plant Visual / Vector Model (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {viewMode === "vector" ? "Virtual Plant Topology & Vascular Mesh" : "Reference Foliar Photo"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Reflecting real-time stomatal conductance and pathogen detection state
              </p>
            </div>

            <span
              className={`text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                isHealthy
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : isDiseased
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isHealthy ? "bg-emerald-600" : isDiseased ? "bg-amber-600" : "bg-gray-400"
                }`}
              />
              {activePlant.health.toUpperCase()}
            </span>
          </div>

          <div className="p-6 bg-gradient-to-b from-green-50/40 via-emerald-50/20 to-white">
            {viewMode === "vector" || imageError ? (
              /* Virtual Crop SVG Simulation */
              <div className="w-full h-80 sm:h-96 bg-radial from-emerald-900/10 via-transparent to-transparent rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-emerald-100/60 p-4">
                <svg
                  viewBox="0 0 400 320"
                  className="w-full h-full max-h-72"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#15803d" />
                      <stop offset="100%" stopColor="#166534" />
                    </linearGradient>
                    <linearGradient id="leafHealthy" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                    <linearGradient id="leafDiseased" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Soil Line & Roots */}
                  <rect x="40" y="270" width="320" height="40" rx="10" fill="#f5ebe0" opacity="0.8" />
                  <line x1="60" y1="270" x2="340" y2="270" stroke="#b08968" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="200" y="295" textAnchor="middle" fontSize="10" fill="#7f5539" fontWeight="bold">
                    ROOT ZONE · SOIL MOISTURE 64% (OPTIMAL HYDRATION)
                  </text>

                  {/* Roots */}
                  <path d="M 200 270 Q 180 290 160 310" stroke="#7f5539" strokeWidth="3" fill="none" />
                  <path d="M 200 270 Q 220 295 240 315" stroke="#7f5539" strokeWidth="3" fill="none" />
                  <path d="M 200 270 Q 195 295 195 320" stroke="#7f5539" strokeWidth="2.5" fill="none" />

                  {/* Central Stem */}
                  <path d="M 200 270 Q 198 180 200 80" stroke="url(#stemGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />

                  {/* Branches & Foliage Nodes */}
                  {/* Left Lower Branch */}
                  <path d="M 199 210 Q 150 190 110 195" stroke="#166534" strokeWidth="4" fill="none" />
                  <ellipse
                    cx="95"
                    cy="195"
                    rx="32"
                    ry="18"
                    transform="rotate(-15 95 195)"
                    fill={isDiseased ? "url(#leafDiseased)" : "url(#leafHealthy)"}
                    filter="url(#glow)"
                  />
                  {isDiseased && (
                    <circle cx="95" cy="195" r="4" fill="#78350f" />
                  )}

                  {/* Right Lower Branch */}
                  <path d="M 200 180 Q 250 160 290 170" stroke="#166534" strokeWidth="4" fill="none" />
                  <ellipse
                    cx="305"
                    cy="170"
                    rx="32"
                    ry="18"
                    transform="rotate(20 305 170)"
                    fill={isDiseased ? "url(#leafDiseased)" : "url(#leafHealthy)"}
                    filter="url(#glow)"
                  />
                  {isDiseased && (
                    <circle cx="305" cy="170" r="4" fill="#78350f" />
                  )}

                  {/* Left Upper Branch */}
                  <path d="M 199 140 Q 160 120 130 115" stroke="#166534" strokeWidth="3.5" fill="none" />
                  <ellipse
                    cx="115"
                    cy="115"
                    rx="26"
                    ry="15"
                    transform="rotate(-25 115 115)"
                    fill="url(#leafHealthy)"
                    filter="url(#glow)"
                  />

                  {/* Right Upper Branch */}
                  <path d="M 200 120 Q 240 100 270 105" stroke="#166534" strokeWidth="3.5" fill="none" />
                  <ellipse
                    cx="285"
                    cy="105"
                    rx="26"
                    ry="15"
                    transform="rotate(25 285 105)"
                    fill="url(#leafHealthy)"
                    filter="url(#glow)"
                  />

                  {/* Apical Meristem (Top Leaf) */}
                  <ellipse
                    cx="200"
                    cy="65"
                    rx="22"
                    ry="28"
                    fill="url(#leafHealthy)"
                    filter="url(#glow)"
                  />

                  {/* Little Tomato Fruit */}
                  <circle cx="215" cy="155" r="10" fill="#dc2626" />
                  <path d="M 215 145 L 213 141 L 217 141 Z" fill="#15803d" />

                  {/* Transpiration Moisture Particles */}
                  <circle cx="100" cy="170" r="2.5" fill="#38bdf8" opacity="0.7">
                    <animate attributeName="cy" values="170;150;130" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.2;0" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="290" cy="140" r="2.5" fill="#38bdf8" opacity="0.7">
                    <animate attributeName="cy" values="140;120;100" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.2;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Status Overlays */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 text-[11px] font-bold text-gray-700 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Virtual Twin Vigor: {isHealthy ? "96% (Vibrant)" : "72% (Pathogen Stress)"}
                </div>

                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 text-[11px] font-bold text-gray-700 shadow-xs flex items-center gap-1.5">
                  <Wind size={13} className="text-cyan-500" />
                  Transpiration: 4.8 mmol/m²s
                </div>
              </div>
            ) : (
              /* Photo Mode with Error Fallback */
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden relative border border-gray-100 bg-gray-50 flex items-center justify-center">
                <img
                  src={
                    isDiseased
                      ? "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-early-blight-plantvillage.webp"
                      : "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-healthy-plantvillage.webp"
                  }
                  alt="Reference leaf foliage"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Plant Action Bar */}
            <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="flex items-center gap-2 text-green-900">
                  <Sprout size={18} className="text-emerald-700" />
                  <h3 className="text-base font-extrabold">{activePlant.name}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Cultivar: {activePlant.variety || "Roma VF"} · Age: {ageDays} Days Post-Germination
                </p>
              </div>

              <Link
                to="/disease-detection"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <ScanSearch size={15} />
                Run AI Diagnosis
              </Link>
            </div>
          </div>
        </div>

        {/* Physiological Attributes Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-xs border border-gray-100 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">
              Physiological Profile
            </h2>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Real-Time
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Crop Identity</p>
              <p className="font-extrabold text-gray-900 text-sm mt-0.5">{activePlant.name}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Taxonomy & Variety</p>
              <p className="font-bold text-gray-700 mt-0.5">{activePlant.variety || "Solanum lycopersicum (Roma VF)"}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Phenological Stage</p>
              <p className="font-bold text-green-700 capitalize mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {activePlant.growthStage} Stage
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Crop Chronological Age</p>
              <p className="font-bold text-gray-700 mt-0.5">{ageDays} Days in Greenhouse</p>
            </div>

            <div>
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Pathological Health State</p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs ${
                    isHealthy
                      ? "bg-emerald-100 text-emerald-800"
                      : isDiseased
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <HeartPulse size={14} />
                  {isHealthy
                    ? "Asymptomatic (Healthy)"
                    : isDiseased
                    ? "Infection Symptoms Flagged"
                    : "Awaiting Vision Scan"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/disease-detection"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-xl border border-gray-200 transition"
              >
                Scan Leaf with Camera
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Environmental Telemetry Sensors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Calibrated Microclimatic Telemetry
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Multi-sensor telemetry streaming canopy moisture, temperature, and photoperiod
            </p>
          </div>

          <Link
            to="/live-monitoring"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Live Chart Feeds <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensorData.map((sensor, index) => {
            const Icon = sensor.icon;
            const colors = {
              blue: "bg-blue-100 text-blue-700",
              orange: "bg-amber-100 text-amber-700",
              cyan: "bg-cyan-100 text-cyan-700",
              yellow: "bg-yellow-100 text-yellow-700",
            };
            const bars = {
              blue: "bg-blue-500",
              orange: "bg-amber-500",
              cyan: "bg-cyan-500",
              yellow: "bg-yellow-500",
            };

            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{sensor.title}</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{sensor.value}</h3>
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
                  <p className="text-[11px] text-emerald-700 font-bold mt-2.5 flex items-center gap-1">
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
