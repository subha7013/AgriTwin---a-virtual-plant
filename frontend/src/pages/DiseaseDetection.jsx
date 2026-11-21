
import { useState, useRef, useEffect } from "react";
import {
  Camera,
  ScanSearch,
  Leaf,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Microscope,
  CameraOff,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  ScanLine,
} from "lucide-react";

function DiseaseDetection() {
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Connect camera stream to video
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Five-second countdown
  useEffect(() => {
    if (!stream || preview) return;

    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(interval);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stream, preview]);

  // Auto capture after countdown
  useEffect(() => {
    if (countdown === 0 && stream && !preview) {
      captureImage();
    }
  }, [countdown, stream, preview]);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera is not supported. Please use localhost or HTTPS."
        );
        return;
      }

      const cameraStream =
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

      setImage(null);
      setPreview("");
      setResult(false);
      setCountdown(5);
      setStream(cameraStream);
    } catch (error) {
      setCameraError(
        "Unable to access camera. Please allow camera permission in your browser."
      );
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setStream(null);
    setCountdown(0);
  };

  // Capture Image
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) {
      setCameraError("Camera is not ready. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError("Unable to capture image. Please try again.");
        return;
      }

      const capturedFile = new File(
        [blob],
        "tomato-leaf-capture.jpg",
        { type: "image/jpeg" }
      );

      setImage(capturedFile);
      setPreview(canvas.toDataURL("image/jpeg"));
      setResult(false);
      setCameraError("");
      stopCamera();
    }, "image/jpeg");
  };

  // Retake Image
  const retakeImage = () => {
    setImage(null);
    setPreview("");
    setResult(false);
    setCameraError("");
  };

  // Reset Everything
  const handleReset = () => {
    stopCamera();
    setImage(null);
    setPreview("");
    setResult(false);
    setCameraError("");
  };

  return (
    <div className="space-y-8 pb-6">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-800 to-emerald-700 p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-emerald-300/10" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-green-100">
              <Sparkles size={14} />
              SMART PLANT HEALTH
            </div>

            <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-white">
              Disease Detection
            </h1>

            <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-green-100/90">
              Scan your tomato leaf automatically using the camera
              and prepare its image for disease analysis.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white">
                <Camera size={17} />
                Auto Scanning
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white">
                <ScanLine size={17} />
                Visual Scan Effect
              </div>
            </div>
          </div>

          <div className="hidden lg:flex h-36 w-36 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-inner">
            <Microscope size={76} className="text-green-100" strokeWidth={1.2} />
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <Leaf size={25} />
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Supported
            </span>
          </div>
          <h3 className="mt-5 font-bold text-gray-800 text-lg">
            Tomato Plant
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Supported plant type for leaf scanning.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Microscope size={25} />
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              Pending
            </span>
          </div>
          <h3 className="mt-5 font-bold text-gray-800 text-lg">
            AI Analysis
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            ML model integration is pending.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <ScanSearch size={25} />
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Available
            </span>
          </div>
          <h3 className="mt-5 font-bold text-gray-800 text-lg">
            Disease Identification
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tomato leaf disease analysis interface.
          </p>
        </div>

      </div>

      {/* Camera and Results */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Camera Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 shadow-sm">

          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Scan Tomato Leaf
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Start the camera. It will automatically capture your leaf
                image after five seconds.
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-green-50 p-3 text-green-700">
              <Camera size={22} />
            </div>
          </div>

          {/* Camera Viewfinder */}
          <div className="relative mt-6 h-72 overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 flex items-center justify-center">

            {preview ? (
              <img
                src={preview}
                alt="Captured tomato leaf"
                className="h-full w-full object-contain bg-black"
              />
            ) : stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-green-100">
                  <Camera size={42} />
                </div>
                <p className="mt-5 font-semibold text-white">
                  Camera is not started
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Click Start Auto Scan to begin.
                </p>
              </div>
            )}

            {/* Dark scanning overlay */}
            {stream && (
              <>
                <div className="absolute inset-0 pointer-events-none bg-green-900/10" />

                {/* Scanning corners */}
                <div className="absolute inset-5 pointer-events-none">
                  <span className="absolute left-0 top-0 h-8 w-8 border-l-[3px] border-t-[3px] border-green-400 rounded-tl-lg" />
                  <span className="absolute right-0 top-0 h-8 w-8 border-r-[3px] border-t-[3px] border-green-400 rounded-tr-lg" />
                  <span className="absolute bottom-0 left-0 h-8 w-8 border-b-[3px] border-l-[3px] border-green-400 rounded-bl-lg" />
                  <span className="absolute bottom-0 right-0 h-8 w-8 border-b-[3px] border-r-[3px] border-green-400 rounded-br-lg" />
                </div>

                {/* Moving scan line */}
                <div className="absolute inset-x-5 top-5 bottom-5 pointer-events-none overflow-hidden">
                  <div className="absolute left-0 right-0 h-1 bg-green-400 shadow-[0_0_12px_4px_rgba(74,222,128,0.8)] animate-leaf-scan" />
                  <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-green-400/25 to-transparent animate-leaf-scan" />
                </div>

                {/* Live Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE SCANNING
                </div>

                {/* Scanning Status */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap rounded-full border border-green-300/30 bg-black/75 px-4 py-2 text-xs font-bold tracking-widest text-green-300">
                  <ScanLine size={15} className="animate-pulse" />
                  SCANNING LEAF...
                </div>

                {/* Countdown */}
                <div className="absolute right-4 top-4 rounded-xl border border-white/20 bg-black/70 px-3 py-2 text-center text-white">
                  <p className="text-[9px] font-semibold tracking-wider text-green-300">
                    CAPTURE IN
                  </p>
                  <p className="text-xl font-bold tabular-nums">
                    {countdown}s
                  </p>
                </div>
              </>
            )}

            {preview && (
              <div className="absolute left-4 top-4 rounded-full bg-green-600/90 px-3 py-1.5 text-xs font-semibold text-white">
                IMAGE CAPTURED
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Error */}
          {cameraError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              {cameraError}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-5 flex flex-wrap gap-3">

            {!stream && !preview && (
              <button
                onClick={startCamera}
                className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                <Camera size={19} />
                Start Auto Scan
              </button>
            )}

            {stream && (
              <button
                onClick={stopCamera}
                className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100"
              >
                <CameraOff size={18} />
                Cancel Scan
              </button>
            )}

            {preview && (
              <button
                onClick={retakeImage}
                className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <RotateCcw size={18} />
                Scan Again
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Reset
            </button>

          </div>

          {/* Image Status */}
          {image && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
              <div className="rounded-full bg-green-100 p-2 text-green-700">
                <CheckCircle size={21} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-green-800">
                  Image Captured Successfully
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {image.name} · {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-gray-50 p-4">
            <ImageIcon size={18} className="mt-0.5 shrink-0 text-gray-500" />
            <p className="text-xs leading-5 text-gray-500">
              Keep the tomato leaf clearly visible and steady during
              the automatic scanning process.
            </p>
          </div>

        </div>

        {/* Results Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 shadow-sm">

          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Detection Results
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your image preparation and analysis status will appear here.
              </p>
            </div>

            <div className="shrink-0 rounded-xl bg-orange-50 p-3 text-orange-600">
              <ScanSearch size={22} />
            </div>
          </div>

          <div className="mt-6">

            {!result ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                  <ScanSearch size={36} className="text-gray-400" />
                </div>

                <h3 className="mt-5 font-bold text-gray-700">
                  No Detection Results Yet
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  Capture a tomato leaf image to prepare it for disease analysis.
                </p>

                {!image && (
                  <span className="mt-4 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    Waiting for image
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                      <AlertTriangle size={25} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-orange-700">
                        Image Captured Successfully
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-gray-800">
                        Ready for AI Analysis
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    Your captured image is ready. Actual disease prediction
                    will be available after AI model and backend integration.
                  </p>
                </div>

                <div className="space-y-4 rounded-xl bg-gray-50 p-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-500">Image Status</span>
                    <span className="font-semibold text-green-700">
                      Captured
                    </span>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-500">AI Model</span>
                    <span className="font-semibold text-orange-600">
                      Not Connected
                    </span>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-500">Prediction</span>
                    <span className="font-semibold text-gray-600">
                      Awaiting Analysis
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                  <ShieldCheck size={19} className="shrink-0" />
                  <span>Image is prepared for future model integration.</span>
                </div>
              </div>
            )}
          </div>

          <button
            disabled={!image}
            onClick={() => setResult(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ScanSearch size={19} />
            Prepare for Analysis
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Actual disease prediction is not active yet.
          </p>

        </div>
      </div>

      {/* Footer Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-green-700" />
        <p className="text-xs leading-6 text-green-800">
          <strong>Note:</strong> Automatic camera capture and visual scanning
          animation are functional. Actual disease prediction and confidence
          score require trained AI model and backend integration.
        </p>
      </div>

      {/* Scanning Animation CSS */}
      <style>{`
        @keyframes leafScan {
          0% {
            top: 0%;
            opacity: 0.3;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0.3;
          }
        }

        .animate-leaf-scan {
          animation: leafScan 2s linear infinite;
        }
      `}</style>

    </div>
  );
}

export default DiseaseDetection;
