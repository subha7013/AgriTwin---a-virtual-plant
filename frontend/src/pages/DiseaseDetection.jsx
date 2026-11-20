
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
} from "lucide-react";

function DiseaseDetection() {
  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Connect camera stream to video
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Stop camera when page closes
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
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

      setStream(cameraStream);
      setImage(null);
      setPreview("");
      setResult(false);
    } catch {
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
      if (!blob) return;

      const capturedFile = new File(
        [blob],
        "tomato-leaf-capture.jpg",
        { type: "image/jpeg" }
      );

      setImage(capturedFile);
      setPreview(canvas.toDataURL("image/jpeg"));
      setResult(false);
      setCameraError("");
    }, "image/jpeg");
  };

  // Retake Image
  const retakeImage = () => {
    setImage(null);
    setPreview("");
    setResult(false);
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
    <div className="space-y-7">

      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Disease Detection 🔬
        </h1>
        <p className="text-gray-500 mt-2">
          Scan a tomato leaf using your camera to analyze plant health.
        </p>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl w-fit">
            <Leaf size={25} />
          </div>
          <h3 className="font-bold text-gray-800 mt-4">
            Tomato Plant
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Supported plant type
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit">
            <Microscope size={25} />
          </div>
          <h3 className="font-bold text-gray-800 mt-4">
            AI Analysis
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            ML model integration pending
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-xl w-fit">
            <ScanSearch size={25} />
          </div>
          <h3 className="font-bold text-gray-800 mt-4">
            Disease Identification
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tomato leaf disease analysis
          </p>
        </div>

      </div>

      {/* Camera and Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Camera Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">

          <h2 className="text-xl font-bold text-gray-800">
            Scan Tomato Leaf
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Open your camera and capture a clear image of the tomato leaf.
          </p>

          {/* Camera Preview */}
          <div className="mt-6 min-h-64 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center relative">

            {preview ? (
              <img
                src={preview}
                alt="Captured tomato leaf"
                className="w-full h-64 object-contain bg-black"
              />
            ) : stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="text-center p-6">
                <Camera size={45} className="text-white mx-auto" />
                <p className="text-white font-semibold mt-4">
                  Camera is not started
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Click Start Camera to begin scanning
                </p>
              </div>
            )}

          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Error */}
          {cameraError && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl mt-4">
              {cameraError}
            </p>
          )}

          {/* Camera Buttons */}
          <div className="flex flex-wrap gap-3 mt-5">

            {!stream && !preview && (
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl font-semibold transition"
              >
                <Camera size={19} />
                Start Camera
              </button>
            )}

            {stream && !preview && (
              <>
                <button
                  onClick={captureImage}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl font-semibold transition"
                >
                  <Camera size={19} />
                  Capture Image
                </button>

                <button
                  onClick={stopCamera}
                  className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 px-4 py-3 rounded-xl font-semibold"
                >
                  <CameraOff size={18} />
                  Stop
                </button>
              </>
            )}

            {preview && (
              <button
                onClick={retakeImage}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold"
              >
                <RotateCcw size={18} />
                Retake Image
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-3 rounded-xl font-semibold"
            >
              Reset
            </button>

          </div>

          {image && (
            <div className="mt-4 flex items-center gap-3 bg-green-50 p-3 rounded-xl">
              <CheckCircle className="text-green-700" size={22} />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Image Captured Successfully
                </p>
                <p className="text-xs text-gray-500">
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Result Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">

          <h2 className="text-xl font-bold text-gray-800">
            Detection Results
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Disease analysis results will appear here.
          </p>

          <div className="mt-6">

            {!result ? (
              <div className="min-h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center p-6">

                <div className="p-4 bg-white rounded-full shadow-sm">
                  <ScanSearch size={35} className="text-gray-400" />
                </div>

                <h3 className="font-semibold text-gray-700 mt-4">
                  No Detection Results Yet
                </h3>

                <p className="text-sm text-gray-500 mt-2 max-w-xs">
                  Capture a tomato leaf image to prepare it for disease analysis.
                </p>

              </div>
            ) : (
              <div className="space-y-5">

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">

                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                      <AlertTriangle size={25} />
                    </div>

                    <div>
                      <p className="text-sm text-orange-700 font-semibold">
                        Image Captured Successfully
                      </p>
                      <h3 className="text-lg font-bold text-gray-800 mt-1">
                        Ready for AI Analysis
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-4 leading-6">
                    Your captured image is ready. Actual disease prediction
                    will be available after AI model and backend integration.
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-5 space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Image Status</span>
                    <span className="text-green-700 font-semibold">
                      Uploaded
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">AI Model</span>
                    <span className="text-orange-600 font-semibold">
                      Not Connected
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prediction</span>
                    <span className="text-gray-600 font-semibold">
                      Awaiting Analysis
                    </span>
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Detect Button */}
          <button
            disabled={!image}
            onClick={() => setResult(true)}
            className="w-full mt-5 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition"
          >
            <ScanSearch size={19} />
            Detect Disease
          </button>

        </div>

      </div>

      <p className="text-xs text-gray-400">
        Note: Camera capture is functional. Actual disease prediction and
        confidence score require trained AI model integration.
      </p>

    </div>
  );
}

export default DiseaseDetection;
