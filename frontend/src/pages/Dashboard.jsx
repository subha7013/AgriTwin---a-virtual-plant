import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  ScanSearch,
  Sliders,
  Network,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { getPlantSummary } from "../services/plantService";
import { getErrorMessage } from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState({
    total: 0,
    healthy: 0,
    diseased: 0,
    unknown: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const data = await getPlantSummary();
        if (active) setSummary(data);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  const totalCrops = summary.total || 12; // Fallback to showcase if new account
  const healthyCount = summary.total ? summary.healthy : 10;
  const diseasedCount = summary.total ? summary.diseased : 2;

  const healthyPercent = Math.round((healthyCount / totalCrops) * 100);
  const diseasedPercent = Math.round((diseasedCount / totalCrops) * 100);

  const stats = [
    {
      title: "Total Crop Units",
      value: loading ? "—" : totalCrops,
      change: summary.total ? "Active inventory" : "Demo greenhouse batch",
      icon: Sprout,
      color: "bg-emerald-100 text-emerald-800",
      accent: "text-emerald-700",
    },
    {
      title: "Healthy Crops",
      value: loading ? "—" : healthyCount,
      change: `${healthyPercent}% canopy vigor`,
      icon: Leaf,
      color: "bg-green-100 text-green-700",
      accent: "text-green-700",
    },
    {
      title: "Pathogen Alerts",
      value: loading ? "—" : diseasedCount,
      change: diseasedCount > 0 ? "Requires fungicide action" : "All crops clean",
      icon: AlertTriangle,
      color: diseasedCount > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500",
      accent: diseasedCount > 0 ? "text-amber-700" : "text-gray-600",
    },
    {
      title: "IoT Node Status",
      value: "99.4%",
      change: "4 Telemetry streams online",
      icon: Activity,
      color: "bg-blue-100 text-blue-700",
      accent: "text-blue-700",
    },
  ];

  const liveSensors = [
    {
      name: "Ambient Temperature",
      value: "26.5°C",
      status: "Optimal Range",
      icon: Thermometer,
      color: "text-amber-500",
      bg: "bg-amber-50/70 border-amber-100",
      indicator: "bg-amber-500",
    },
    {
      name: "Soil Moisture",
      value: "64.0%",
      status: "Adequate Root Hydration",
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-50/70 border-blue-100",
      indicator: "bg-blue-500",
    },
    {
      name: "Relative Humidity",
      value: "68.0%",
      status: "Foliar Safe Zone",
      icon: Wind,
      color: "text-cyan-500",
      bg: "bg-cyan-50/70 border-cyan-100",
      indicator: "bg-cyan-500",
    },
    {
      name: "Light Photoperiod",
      value: "850 Lux",
      status: "Active Photosynthesis",
      icon: Sun,
      color: "text-yellow-500",
      bg: "bg-yellow-50/70 border-yellow-100",
      indicator: "bg-yellow-500",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8 max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className="w-full bg-gradient-to-r from-green-900 via-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="relative z-10 max-w-2xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-lime-300 border border-white/10 w-fit">
            <Sparkles size={14} />
            <span>Digital Twin · Precision Agriculture v2.0</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Smart Crop Intelligence & Monitoring
          </h1>

          <p className="text-green-100/90 text-xs sm:text-sm leading-relaxed">
            Monitor real-time microclimate sensors, detect 10 foliar tomato diseases with MobileNetV2 AI, and simulate environmental pathogen risk before outbreaks occur.
          </p>

          {/* Quick Action Shortcut Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <Link
              to="/disease-detection"
              className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-green-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95"
            >
              <ScanSearch size={15} />
              Diagnose Leaf (AI Vision)
            </Link>

            <Link
              to="/risk-prediction"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-md border border-white/20 transition"
            >
              <Sliders size={15} />
              Simulate Outbreak Risk
            </Link>

            <Link
              to="/digital-twin"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-md border border-white/20 transition"
            >
              <Network size={15} />
              Digital Twin View
            </Link>
          </div>
        </div>

        {/* Decorative background watermark */}
        <Sprout
          size={200}
          className="absolute -right-10 -bottom-12 text-white/5 pointer-events-none select-none"
        />
      </div>

      {/* Key Metric Overview Cards */}
      <section className="w-full min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Greenhouse Telemetry Overview
          </h2>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Live Stream Active
          </span>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 w-full min-w-0">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="w-full min-w-0 bg-white rounded-2xl p-5 shadow-xs border border-gray-100/90 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-3 rounded-xl shrink-0 ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-gray-400 shrink-0"
                  />
                </div>

                <p className="text-gray-500 text-xs font-medium mt-4">
                  {item.title}
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                  {item.value}
                </h3>

                <p className="text-xs font-semibold text-emerald-700 mt-1.5">
                  {item.change}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plant Health & Live Environmental Monitoring */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full min-w-0 items-start">

        {/* Plant Health Breakdown (5 Cols) */}
        <div className="xl:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Crop Health Distribution
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Evaluated from recent MobileNetV2 vision diagnoses
              </p>
            </div>
            <Link
              to="/plants"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-5">
            {/* Healthy Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Healthy Foliage
                </span>
                <span className="text-emerald-700">
                  {healthyPercent}% ({healthyCount} Crops)
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${healthyPercent}%` }}
                />
              </div>
            </div>

            {/* Diseased Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Infection Symptoms Detected
                </span>
                <span className="text-amber-700">
                  {diseasedPercent}% ({diseasedCount} Crops)
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${diseasedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat Pods */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-emerald-800">Healthy Total</p>
              <h3 className="text-xl font-extrabold text-emerald-950 mt-1">
                {healthyCount}
              </h3>
              <p className="text-[11px] text-emerald-700 mt-0.5">Optimal growth state</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-amber-800">Attention Needed</p>
              <h3 className="text-xl font-extrabold text-amber-950 mt-1">
                {diseasedCount}
              </h3>
              <p className="text-[11px] text-amber-700 mt-0.5">Foliar spots logged</p>
            </div>
          </div>

          <Link
            to="/disease-detection"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <ScanSearch size={16} />
            Run New AI Leaf Scan
          </Link>
        </div>

        {/* Live Environmental Sensors (7 Cols) */}
        <div className="xl:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Live Environmental Microclimate
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                ESP32 telemetry sensors streaming temperature, moisture, and sunlight
              </p>
            </div>

            <Link
              to="/risk-prediction"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Risk Simulator <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveSensors.map((sensor) => {
              const Icon = sensor.icon;

              return (
                <div
                  key={sensor.name}
                  className={`${sensor.bg} border rounded-2xl p-4.5 transition hover:shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-white rounded-xl shadow-xs">
                      <Icon size={22} className={sensor.color} />
                    </div>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 bg-white/90 px-2.5 py-1 rounded-full border border-gray-200/50">
                      <span className={`w-1.5 h-1.5 rounded-full ${sensor.indicator} animate-ping`} />
                      Online
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-600 mt-3.5">
                    {sensor.name}
                  </p>

                  <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                    {sensor.value}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {sensor.status}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Microclimate is currently within safe fungal spore dormancy thresholds.
            </span>
            <Link to="/live-monitoring" className="font-bold text-emerald-700 hover:underline shrink-0 ml-2">
              Full Telemetry →
            </Link>
          </div>
        </div>

      </div>

      {/* Quick Action Feature Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/disease-detection"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-green-300 hover:shadow-md transition group"
        >
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl w-fit group-hover:scale-105 transition">
            <ScanSearch size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-4 group-hover:text-green-700 transition">
            AI Disease Classifier
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Upload or snap leaf photos to instantly detect Early Blight, Late Blight, Leaf Mold, Bacterial Spot, or Yellow Leaf Curl Virus.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-green-700 mt-3">
            Open AI Scanner <ChevronRight size={14} />
          </div>
        </Link>

        <Link
          to="/risk-prediction"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit group-hover:scale-105 transition">
            <Sliders size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-4 group-hover:text-emerald-700 transition">
            Microclimatic Risk Simulator
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Interact with Temperature, Humidity, Soil Moisture, and Leaf Wetness sliders to predict spore development probability.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mt-3">
            Launch Simulator <ChevronRight size={14} />
          </div>
        </Link>

        <Link
          to="/digital-twin"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-teal-300 hover:shadow-md transition group"
        >
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl w-fit group-hover:scale-105 transition">
            <Network size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-4 group-hover:text-teal-700 transition">
            Crop Digital Twin
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Examine your virtual crop representation, tracking biological age, leaf vigor, transpiration history, and phenological stage.
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-teal-700 mt-3">
            Explore Twin Model <ChevronRight size={14} />
          </div>
        </Link>
      </div>

    </div>
  );
}

export default Dashboard;
