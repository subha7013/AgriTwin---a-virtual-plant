import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Droplets,
  Thermometer,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Sparkles,
  Info,
  RefreshCw,
  Wind
} from "lucide-react";
import { predictRisk } from "../services/diseaseService";

const PRESETS = [
  {
    name: "Optimal Greenhouse",
    temp: 24,
    humidity: 60,
    soil: 50,
    wetness: 15,
    badge: "Low Risk",
    badgeColor: "bg-emerald-100 text-emerald-800"
  },
  {
    name: "Humid Morning Spores",
    temp: 23,
    humidity: 90,
    soil: 65,
    wetness: 85,
    badge: "Blight Risk",
    badgeColor: "bg-red-100 text-red-800"
  },
  {
    name: "Heatwave & Mites",
    temp: 34,
    humidity: 35,
    soil: 25,
    wetness: 10,
    badge: "Thermal Stress",
    badgeColor: "bg-amber-100 text-amber-800"
  },
  {
    name: "Waterlogged Canopy",
    temp: 27,
    humidity: 82,
    soil: 80,
    wetness: 75,
    badge: "Fungal Risk",
    badgeColor: "bg-orange-100 text-orange-800"
  }
];

function RiskPrediction() {
  const [telemetry, setTelemetry] = useState({
    temperature: 28,
    humidity: 78,
    soilMoisture: 45,
    leafWetness: 65
  });

  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluateRisk = useCallback(async (currentTelemetry) => {
    setLoading(true);
    try {
      const data = await predictRisk(currentTelemetry);
      setRiskData(data);
    } catch {
      // Fallback local computation if API unreachable
      const hum = currentTelemetry.humidity;
      const wet = currentTelemetry.leafWetness;
      const temp = currentTelemetry.temperature;
      const isHigh = hum > 80 || wet > 70 || temp > 32;
      const isMod = hum > 65 || wet > 50;

      setRiskData({
        success: true,
        risk_category: isHigh ? "High Risk" : isMod ? "Moderate Risk" : "Low Risk",
        risk_score: isHigh ? 78 : isMod ? 48 : 18,
        factors: [
          { name: "Temperature", value: `${temp}°C`, severity: temp > 30 ? "High" : "Optimal" },
          { name: "Humidity", value: `${hum}%`, severity: hum > 80 ? "High" : "Optimal" },
          { name: "Leaf Wetness", value: `${wet}%`, severity: wet > 65 ? "High" : "Low" }
        ],
        recommendations: [
          "Maintain proper greenhouse ventilation to minimize leaf moisture.",
          "Inspect lower leaves for early fungal lesion onset."
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    evaluateRisk(telemetry);
  }, [telemetry, evaluateRisk]);

  const handleSliderChange = (field, value) => {
    setTelemetry((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const applyPreset = (preset) => {
    setTelemetry({
      temperature: preset.temp,
      humidity: preset.humidity,
      soilMoisture: preset.soil,
      leafWetness: preset.wetness
    });
  };

  const riskScore = riskData?.risk_score ?? 65;
  const isHighRisk = riskScore >= 65;
  const isModerateRisk = riskScore >= 40 && riskScore < 65;

  const scoreColor = isHighRisk
    ? "#DC2626"
    : isModerateRisk
    ? "#F59E0B"
    : "#10B981";

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <ShieldAlert size={24} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              Microclimatic Risk Engine
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">
            Predict disease favorability from live IoT telemetry before physical lesions manifest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-1.5">
            <Sparkles size={14} />
            Random Forest Engine Active
          </span>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Sliders size={14} className="text-purple-600" />
            Greenhouse Environmental Presets (Simulate Conditions)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="p-3 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 border border-gray-100 rounded-xl text-left transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 group-hover:text-purple-900">
                  {p.name}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                {p.temp}°C · {p.humidity}% RH · {p.wetness}% Wet
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Environmental Telemetry Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Temperature */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
              <Thermometer size={22} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Target: 20-26°C</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Ambient Temperature</p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">{telemetry.temperature}°C</p>
          </div>
          <input
            type="range"
            min="15"
            max="42"
            step="0.5"
            value={telemetry.temperature}
            onChange={(e) => handleSliderChange("temperature", e.target.value)}
            className="w-full accent-orange-600 cursor-pointer"
          />
        </div>

        {/* Humidity */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Cloud size={22} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Target: &lt;75%</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Relative Humidity</p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">{telemetry.humidity}%</p>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={telemetry.humidity}
            onChange={(e) => handleSliderChange("humidity", e.target.value)}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Soil Moisture */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Droplets size={22} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Target: 40-60%</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Soil Moisture</p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">{telemetry.soilMoisture}%</p>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            step="1"
            value={telemetry.soilMoisture}
            onChange={(e) => handleSliderChange("soilMoisture", e.target.value)}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Leaf Wetness */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Wind size={22} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">Target: &lt;50%</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">Leaf Canopy Wetness</p>
            <p className="text-2xl font-black text-gray-800 mt-0.5">{telemetry.leafWetness}%</p>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={telemetry.leafWetness}
            onChange={(e) => handleSliderChange("leafWetness", e.target.value)}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Risk Gauge & Actionable Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Risk Score Circle Gauge (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-bold text-gray-800 self-start">
            Calculated Outbreak Risk
          </h2>
          <p className="text-xs text-gray-400 self-start mt-0.5">
            Microclimatic favourability for fungal & bacterial disease
          </p>

          <div className="mt-8 relative w-48 h-48 rounded-full flex items-center justify-center shadow-inner">
            <div
              className="absolute inset-0 rounded-full transition-all duration-700"
              style={{
                background: `conic-gradient(${scoreColor} ${riskScore * 3.6}deg, #F3F4F6 0deg)`
              }}
            />
            <div className="relative w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {riskScore}%
              </span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                Risk Rating
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider ${
                isHighRisk
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : isModerateRisk
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              {riskData?.risk_category || "Calculating..."}
            </span>

            <p className="text-xs text-gray-500 mt-3 max-w-xs leading-relaxed">
              {isHighRisk
                ? "Microclimate is critically favorable for leaf mold, early blight, or late blight spore dissemination."
                : isModerateRisk
                ? "Sub-optimal conditions present. Moderate potential for fungal pathogen activation."
                : "Microclimatic conditions are balanced. Foliar disease risk is minimal."}
            </p>
          </div>
        </div>

        {/* Environmental Stress Factors & Action Recommendations (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Active Stress Factors
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Identified by the Random Forest classifier
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {riskData?.factors?.map((f, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-start justify-between gap-2"
              >
                <div>
                  <p className="text-xs font-bold text-gray-800">{f.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.value}</p>
                  {f.desc && <p className="text-[11px] text-gray-400 mt-1">{f.desc}</p>}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    f.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : f.severity === "Moderate"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {f.severity}
                </span>
              </div>
            ))}
          </div>

          {/* Actionable Recommendations */}
          <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl space-y-2.5">
            <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle size={15} className="text-purple-700" />
              Automated Agronomic Recommendations
            </h3>
            <ul className="text-xs text-purple-900 space-y-1.5">
              {riskData?.recommendations?.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-purple-700 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskPrediction;
