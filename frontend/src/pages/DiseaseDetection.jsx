import { useState, useRef, useEffect } from "react";
import {
  Camera,
  ScanSearch,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Microscope,
  CameraOff,
  Upload,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  FileText,
  Loader2,
  XCircle,
  Sprout,
  ArrowRight
} from "lucide-react";
import { detectDisease } from "../services/diseaseService";
import { getPlants } from "../services/plantService";
import { getErrorMessage } from "../services/api";

function DiseaseDetection() {
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' | 'camera'
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [apiError, setApiError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load plants on mount for association
  useEffect(() => {
    async function loadUserPlants() {
      try {
        const data = await getPlants();
        if (data && data.plants) {
          setPlants(data.plants);
        }
      } catch {
        // Continue if unauthenticated or error
      }
    }
    loadUserPlants();
  }, []);

  // Connect camera stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Clean up camera stream on unmount or tab switch
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setCameraError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser. Please use file upload.");
        return;
      }

      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setStream(cameraStream);
      setImageFile(null);
      setPreview("");
      setDiagnosisResult(null);
    } catch {
      setCameraError("Unable to access camera. Please allow camera permissions in browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) {
      setCameraError("Camera is not ready yet. Please wait a second.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "leaf-camera-capture.jpg", { type: "image/jpeg" });
      setImageFile(file);
      setPreview(canvas.toDataURL("image/jpeg"));
      setDiagnosisResult(null);
      setCameraError("");
      stopCamera();
    }, "image/jpeg", 0.95);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setApiError("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    setApiError("");
    setCameraError("");
    setImageFile(file);
    setDiagnosisResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setApiError("");
      setImageFile(file);
      setDiagnosisResult(null);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    stopCamera();
    setImageFile(null);
    setPreview("");
    setDiagnosisResult(null);
    setCameraError("");
    setApiError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runDiagnosis = async () => {
    if (!imageFile && !preview) return;

    setAnalyzing(true);
    setApiError("");

    try {
      let payload;
      if (imageFile) {
        payload = { imageFile, plantId: selectedPlantId || undefined };
      } else {
        payload = { imageBase64: preview, plantId: selectedPlantId || undefined };
      }

      const res = await detectDisease(payload);
      setDiagnosisResult(res);
    } catch (err) {
      setApiError(getErrorMessage(err) || "Failed to analyze leaf image. Ensure ML backend is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const isHealthy = diagnosisResult?.diagnosis?.isHealthy;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-green-100 text-green-700 rounded-xl">
              <Microscope size={24} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
              AI Disease Detection
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">
            Identify 10 tomato conditions with edge-optimized MobileNetV2 deep learning.
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 w-fit self-start sm:self-auto border border-gray-200/60 shadow-xs">
          <button
            onClick={() => {
              setActiveTab("upload");
              stopCamera();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "upload"
                ? "bg-green-700 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Upload size={14} />
            Upload Photo
          </button>
          <button
            onClick={() => {
              setActiveTab("camera");
              startCamera();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "camera"
                ? "bg-green-700 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Camera size={14} />
            Live Camera
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Image Input & Capture (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Leaf size={18} className="text-green-600" />
              Leaf Input
            </h2>
            {preview && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition flex items-center gap-1"
              >
                <RotateCcw size={13} />
                Clear
              </button>
            )}
          </div>

          {/* Plant Selector */}
          {plants.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Assign Diagnosis to Tracked Plant (Optional)
              </label>
              <select
                value={selectedPlantId}
                onChange={(e) => setSelectedPlantId(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl p-2.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition"
              >
                <option value="">Do not assign to a plant (Instant check)</option>
                {plants.map((p) => (
                  <option key={p._id} value={p._id}>
                    🌱 {p.name} ({p.variety || "Tomato"} - {p.health})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Viewport Box */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-950 aspect-[4/3] flex items-center justify-center border border-gray-200">
            {preview ? (
              <div className="relative w-full h-full group">
                <img
                  src={preview}
                  alt="Leaf preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="p-2.5 bg-white/90 text-gray-800 rounded-xl hover:bg-white transition text-xs font-semibold shadow"
                  >
                    Retake / Choose Another
                  </button>
                </div>
              </div>
            ) : activeTab === "camera" && stream ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Visual Leaf Alignment Reticle */}
                <div className="absolute inset-8 border-2 border-dashed border-green-400/70 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] font-medium text-green-300 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Center leaf blade inside frame
                  </span>
                </div>
              </div>
            ) : activeTab === "camera" ? (
              <div className="text-center p-6 text-gray-400">
                <CameraOff size={42} className="mx-auto mb-2 opacity-60 text-gray-400" />
                <p className="text-sm font-medium text-gray-200">Camera Inactive</p>
                <p className="text-xs text-gray-400 mt-1">Click start to activate camera scanner</p>
                <button
                  onClick={startCamera}
                  className="mt-4 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-xl transition"
                >
                  Start Camera
                </button>
              </div>
            ) : (
              /* Drag & Drop Upload Zone */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-900/60 transition group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-4 bg-gray-800 group-hover:bg-green-900/40 rounded-2xl text-green-400 mb-3 transition">
                  <Upload size={32} />
                </div>
                <p className="text-sm font-semibold text-gray-200">
                  Click to browse or drag & drop leaf
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports JPG, PNG, WEBP (Max 25MB)
                </p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Controls */}
          {activeTab === "camera" && stream && !preview && (
            <div className="flex gap-3">
              <button
                onClick={captureImage}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl font-semibold shadow-sm transition text-sm"
              >
                <Camera size={18} />
                Capture Leaf
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium text-sm transition"
              >
                <CameraOff size={16} />
                Stop
              </button>
            </div>
          )}

          {cameraError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {apiError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <XCircle size={15} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Diagnose Button */}
          <button
            disabled={!preview || analyzing}
            onClick={runDiagnosis}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 px-5 rounded-xl font-bold shadow-md shadow-green-900/10 transition text-sm sm:text-base cursor-pointer disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 size={19} className="animate-spin text-white" />
                Analyzing with MobileNetV2...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Run AI Diagnosis
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Clinical Diagnosis Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!diagnosisResult ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="p-5 bg-green-50 text-green-600 rounded-3xl mb-4">
                <ScanSearch size={48} className="stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Awaiting Leaf Scan
              </h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md">
                Upload or capture a close-up photo of a tomato leaf. The neural network will analyze tissue symptoms, lesions, and chlorosis patterns.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 w-full max-w-lg text-left">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase">Input Shape</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">256 × 256 RGB</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase">Backbone</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">MobileNetV2</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase">Quality Gate</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">Laplacian Blur & Exposure</p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Diagnostic Report Card */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Status Banner */}
              <div
                className={`p-6 sm:p-7 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isHealthy
                    ? "bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border-emerald-100"
                    : "bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3.5 rounded-2xl text-white shadow-sm shrink-0 ${
                      isHealthy ? "bg-emerald-600" : "bg-red-600"
                    }`}
                  >
                    {isHealthy ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
                  </div>
                  <div>
                    <span
                      className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${
                        isHealthy
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {diagnosisResult.diseaseProfile?.category || (isHealthy ? "Healthy" : "Infection Detected")}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                      {diagnosisResult.diagnosis.disease}
                    </h2>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-gray-200/60 shadow-xs shrink-0 sm:text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Model Confidence
                  </p>
                  <p
                    className={`text-2xl font-black ${
                      isHealthy ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {diagnosisResult.diagnosis.confidencePct}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 space-y-6">
                {/* Associated Plant Badge */}
                {diagnosisResult.diagnosis.plantName && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-green-50 border border-green-200/80 rounded-2xl text-xs text-green-900 font-semibold">
                    <Sprout size={18} className="text-green-700 shrink-0" />
                    <span>
                      Diagnosis automatically synced with crop profile:{" "}
                      <strong className="underline decoration-green-600">{diagnosisResult.diagnosis.plantName}</strong>
                    </span>
                  </div>
                )}

                {/* Disease Description */}
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                    Pathological Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                    {diagnosisResult.diseaseProfile?.description}
                  </p>
                </div>

                {/* Symptoms & Causes Grid */}
                {(!isHealthy && diagnosisResult.diseaseProfile?.symptoms?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70">
                      <h4 className="text-xs font-black text-amber-950 flex items-center gap-2 mb-2.5">
                        <FileText size={15} className="text-amber-700" />
                        Diagnostic Symptoms
                      </h4>
                      <ul className="text-xs text-amber-900 space-y-2 pl-4 list-disc font-medium leading-relaxed">
                        {diagnosisResult.diseaseProfile.symptoms.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/70">
                      <h4 className="text-xs font-black text-blue-950 flex items-center gap-2 mb-2.5">
                        <HelpCircle size={15} className="text-blue-700" />
                        Root Causes
                      </h4>
                      <ul className="text-xs text-blue-900 space-y-2 pl-4 list-disc font-medium leading-relaxed">
                        {diagnosisResult.diseaseProfile.causes.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Treatment & Prevention Action Plan */}
                <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                  <h4 className="text-xs font-black text-emerald-950 flex items-center gap-2 mb-3">
                    <ShieldAlert size={16} className="text-emerald-700" />
                    Agronomic Prevention & Treatment Recommendations
                  </h4>
                  <ul className="text-xs text-emerald-950 space-y-2.5 font-medium">
                    {diagnosisResult.diseaseProfile?.prevention?.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Probabilities Breakdown */}
                {diagnosisResult.probabilities && Object.keys(diagnosisResult.probabilities).length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                      Top Predicted Probabilities
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(diagnosisResult.probabilities)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([className, probVal]) => {
                          const pct = Math.round(probVal * 100);
                          return (
                            <div key={className} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold text-gray-700">
                                <span>{className}</span>
                                <span className="font-extrabold text-gray-900">{pct}%</span>
                              </div>
                              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    className.includes("Healthy")
                                      ? "bg-emerald-500"
                                      : "bg-amber-500"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <RotateCcw size={15} />
                    Scan Another Leaf
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;
