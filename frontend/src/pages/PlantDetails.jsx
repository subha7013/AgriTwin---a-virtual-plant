
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Leaf,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Sprout,
} from "lucide-react";

const diseaseData = {
  Healthy: {
    category: "Healthy Tomato Leaf",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-healthy-plantvillage.webp",
    description: "A healthy tomato leaf has a natural green colour and shows no visible signs of disease.",
    symptoms: [
      "Bright and natural green leaves",
      "Normal leaf shape and size",
      "Healthy plant growth",
    ],
    causes: [
      "Proper sunlight",
      "Balanced soil nutrients",
      "Suitable watering",
    ],
    prevention: [
      "Maintain regular watering",
      "Provide adequate sunlight",
      "Monitor plant health regularly",
    ],
  },

  "Early Blight": {
    category: "Fungal Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-early-blight-plantvillage.webp",
    description: "Early Blight is a fungal disease that commonly affects tomato leaves, especially older leaves.",
    symptoms: [
      "Brown circular spots on leaves",
      "Concentric ring patterns",
      "Yellowing around affected areas",
    ],
    causes: [
      "Fungal infection by Alternaria solani",
      "Warm and humid weather",
      "Wet leaves for long periods",
    ],
    prevention: [
      "Remove infected leaves",
      "Avoid watering directly on leaves",
      "Maintain proper spacing between plants",
    ],
  },

  "Late Blight": {
    category: "Fungal Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-late-blight-plantvillage.webp",
    description: "Late Blight is a serious tomato disease that can spread quickly during cool and humid weather.",
    symptoms: [
      "Dark water-soaked leaf patches",
      "Brown or black damaged areas",
      "White fungal growth in humid conditions",
    ],
    causes: [
      "Infection by Phytophthora infestans",
      "Cool and wet weather",
      "High humidity",
    ],
    prevention: [
      "Remove infected plant material",
      "Avoid overhead watering",
      "Ensure good air circulation",
    ],
  },

  "Bacterial Spot": {
    category: "Bacterial Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-bacterial-spot-plantvillage.webp",
    description: "Bacterial Spot causes small dark lesions on tomato leaves and can affect fruits.",
    symptoms: [
      "Small dark spots on leaves",
      "Yellow areas around spots",
      "Leaf damage in severe cases",
    ],
    causes: [
      "Infection by Xanthomonas bacteria",
      "Wet and humid conditions",
      "Spread through contaminated tools and water",
    ],
    prevention: [
      "Use disease-free seeds",
      "Avoid working with wet plants",
      "Clean gardening tools regularly",
    ],
  },

  "Septoria Leaf Spot": {
    category: "Fungal Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-septoria-plantvillage.webp",
    description: "Septoria Leaf Spot is a fungal disease that usually begins on older tomato leaves.",
    symptoms: [
      "Small circular spots",
      "Dark brown borders around spots",
      "Tiny dark structures inside spots",
    ],
    causes: [
      "Infection by Septoria lycopersici",
      "Warm and wet conditions",
      "Infected plant debris",
    ],
    prevention: [
      "Remove infected leaves",
      "Keep lower leaves away from soil",
      "Practice crop rotation",
    ],
  },

  "Leaf Mold": {
    category: "Fungal Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-leaf-mold-plantvillage.webp",
    description: "Leaf Mold is a fungal disease that mainly affects tomato leaves under high humidity.",
    symptoms: [
      "Pale green or yellow patches",
      "Olive-green mold underneath leaves",
      "Leaves may curl and dry",
    ],
    causes: [
      "Infection by Passalora fulva",
      "High humidity",
      "Poor air circulation",
    ],
    prevention: [
      "Improve air circulation",
      "Avoid excessive moisture",
      "Remove infected leaves",
    ],
  },

  "Target Spot": {
    category: "Fungal Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-target-spot-plantvillage.webp",
    description: "Target Spot produces circular lesions on tomato leaves and may affect stems and fruits.",
    symptoms: [
      "Brown circular leaf spots",
      "Target-like ring patterns",
      "Yellowing and leaf damage",
    ],
    causes: [
      "Infection by Corynespora cassiicola",
      "Warm and humid conditions",
      "Poor air circulation",
    ],
    prevention: [
      "Remove infected leaves",
      "Maintain proper plant spacing",
      "Avoid excessive leaf moisture",
    ],
  },

  "Spider Mites": {
    category: "Pest Damage",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-spider-mites-plantvillage.webp",
    description: "Spider mites are tiny pests that feed on tomato leaves and damage plant tissues.",
    symptoms: [
      "Tiny yellow or white spots",
      "Fine webbing under leaves",
      "Dry and damaged leaves",
    ],
    causes: [
      "Spider mite infestation",
      "Hot and dry conditions",
      "Lack of regular pest monitoring",
    ],
    prevention: [
      "Inspect the underside of leaves",
      "Remove heavily infested leaves",
      "Use suitable pest control methods",
    ],
  },

  "Tomato Mosaic Virus": {
    category: "Viral Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-mosaic-plantvillage.webp",
    description: "Tomato Mosaic Virus affects tomato growth and produces irregular colour patterns on leaves.",
    symptoms: [
      "Light and dark green mosaic patterns",
      "Wrinkled or distorted leaves",
      "Reduced plant growth",
    ],
    causes: [
      "Infection by Tomato Mosaic Virus",
      "Contaminated tools and hands",
      "Infected plant material",
    ],
    prevention: [
      "Use clean gardening tools",
      "Remove infected plants",
      "Wash hands after handling infected plants",
    ],
  },

  "Tomato Yellow Leaf Curl Virus": {
    category: "Viral Disease",
    image: "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-yellow-leaf-curl-plantvillage.webp",
    description: "Tomato Yellow Leaf Curl Virus is a viral disease that affects leaf shape and plant growth.",
    symptoms: [
      "Yellowing of leaf margins",
      "Upward curling of leaves",
      "Stunted plant growth",
    ],
    causes: [
      "Infection by Tomato Yellow Leaf Curl Virus",
      "Spread mainly by whiteflies",
      "Presence of infected plants",
    ],
    prevention: [
      "Monitor and manage whiteflies",
      "Remove infected plants",
      "Use suitable protective netting",
    ],
  },
};

function PlantDetails() {
  const [searchParams] = useSearchParams();
  const diseaseName = searchParams.get("disease") || "Healthy";

  const disease = diseaseData[diseaseName] || diseaseData.Healthy;

  return (
    <div className="space-y-7">

      <Link
        to="/plants"
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold"
      >
        <ArrowLeft size={19} />
        Back to Plants
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Plant Details 🌱
        </h1>
        <p className="text-gray-500 mt-2">
          Detailed information about tomato leaf health and diseases.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          <div className="h-64 sm:h-80 lg:h-full min-h-[300px] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative flex items-center justify-center overflow-hidden">
            <img
              src={disease.image}
              alt={diseaseName}
              className="w-full h-full object-cover relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-800/40">
              <Leaf size={64} />
              <span className="text-xs font-bold mt-2 text-emerald-800/60 uppercase tracking-widest">
                {diseaseName} Reference
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-center">

            <span className={`w-fit text-sm font-semibold px-4 py-2 rounded-full ${
              diseaseName === "Healthy"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}>
              {diseaseName === "Healthy" ? "Healthy" : "Disease Information"}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-5">
              {diseaseName}
            </h2>

            <p className="text-green-700 font-medium mt-2">
              {disease.category}
            </p>

            <p className="text-gray-600 leading-7 mt-5">
              {disease.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-7">

              <div className="bg-green-50 p-4 rounded-xl">
                <Leaf className="text-green-700 mb-2" size={23} />
                <p className="text-sm text-gray-500">Plant Type</p>
                <p className="font-bold text-gray-800">Tomato</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl">
                <Activity className="text-orange-600 mb-2" size={23} />
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-bold text-gray-800">
                  {disease.category}
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <AlertTriangle size={23} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Symptoms
            </h3>
          </div>

          <ul className="space-y-3">
            {disease.symptoms.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm text-gray-600">
                <span className="text-orange-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Sprout size={23} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Causes
            </h3>
          </div>

          <ul className="space-y-3">
            {disease.causes.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
              <ShieldCheck size={23} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Prevention
            </h3>
          </div>

          <ul className="space-y-3">
            {disease.prevention.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm text-gray-600">
                <span className="text-green-600">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      <p className="text-xs text-gray-400">
        Note: This information is for educational purposes. Confirm disease
        diagnosis before applying any treatment.
      </p>

    </div>
  );
}

export default PlantDetails;
