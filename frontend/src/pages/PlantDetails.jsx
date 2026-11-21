
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Leaf,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Sprout,
  CheckCircle2,
  Bug,
  Info,
  Flower2,
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
  const isHealthy = diseaseName === "Healthy";

  const informationSections = [
    {
      title: "Symptoms",
      subtitle: "Signs to look out for",
      items: disease.symptoms,
      icon: AlertTriangle,
      color: "text-orange-600",
      iconBg: "bg-orange-50",
      numberBg: "bg-orange-50 text-orange-700",
    },
    {
      title: "Causes",
      subtitle: "Possible contributing factors",
      items: disease.causes,
      icon: Bug,
      color: "text-blue-600",
      iconBg: "bg-blue-50",
      numberBg: "bg-blue-50 text-blue-700",
    },
    {
      title: "Prevention",
      subtitle: "Ways to protect your plants",
      items: disease.prevention,
      icon: ShieldCheck,
      color: "text-emerald-700",
      iconBg: "bg-emerald-50",
      numberBg: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-8 pb-6">

      {/* Back Navigation */}
      <Link
        to="/plants"
        className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back to Plants
      </Link>

      {/* Page Heading */}
      <section className="relative isolate w-full min-w-0 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#073b2b] via-[#086044] to-[#159568] px-5 py-8 text-white shadow-xl shadow-green-950/10 sm:px-9 sm:py-10">

        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-white/[0.06]" />

        <div className="pointer-events-none absolute -bottom-24 right-36 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="pointer-events-none absolute right-8 top-8 hidden opacity-[0.08] sm:block">
          <Flower2 size={180} strokeWidth={1} />
        </div>

        <div className="relative z-10 w-full min-w-0">

          {/* Plant Health Label */}
          <div className="mb-5 flex w-fit max-w-full items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-left text-lime-100">
            <span className="text-sm font-bold leading-6 tracking-normal">
              PLANT HEALTH INFORMATION
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Plant Details
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-green-50/85 sm:text-base">
            Understand plant conditions, identify symptoms and explore useful prevention information for tomato crops.
          </p>

        </div>
      </section>

      {/* Main Plant Information */}
      <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Plant Image */}
          <div className="group relative flex min-h-[300px] items-center justify-center overflow-hidden bg-emerald-50 p-5 sm:min-h-[420px]">

            <img
              src={disease.image}
              alt={diseaseName}
              className="relative z-10 h-auto max-h-[460px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />

            <div className="absolute bottom-5 left-5 z-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-xs font-bold text-gray-800 shadow-lg">
                <Sprout size={15} className="text-emerald-700" />
                TOMATO PLANT
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex min-w-0 flex-col justify-center p-6 sm:p-9">

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold ${
                  isHealthy
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-orange-50 text-orange-700"
                }`}
              >
                {isHealthy ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertTriangle size={15} />
                )}
                {isHealthy ? "Healthy Plant" : "Disease Information"}
              </span>

              <span className="rounded-full bg-gray-100 px-3.5 py-2 text-xs font-semibold text-gray-600">
                {disease.category}
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-gray-800 sm:text-3xl">
              {diseaseName}
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              {disease.description}
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <Leaf size={21} />
                </div>
                <p className="text-xs font-medium text-gray-500">
                  Plant Type
                </p>
                <p className="mt-1 font-bold text-gray-800">
                  Tomato
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                  <Activity size={21} />
                </div>
                <p className="text-xs font-medium text-gray-500">
                  Category
                </p>
                <p className="mt-1 font-bold text-gray-800">
                  {disease.category}
                </p>
              </div>

            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
              <Info size={19} className="mt-0.5 shrink-0 text-emerald-700" />
              <p className="text-xs leading-5 text-gray-500">
                Review the information below to understand the symptoms, possible causes and prevention methods.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Detailed Information
            </h2>
          </div>

          <p className="ml-3 mt-1 text-sm text-gray-500">
            Important information about this plant condition
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {informationSections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-2xl p-3 ${section.iconBg} ${section.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {section.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <div className="my-5 h-px bg-gray-100" />

                <ul className="space-y-4">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${section.numberBg}`}>
                        {index + 1}
                      </span>

                      <span className="pt-0.5 text-sm leading-6 text-gray-600">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Important Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
        <div className="rounded-xl bg-white p-2 text-amber-600 shadow-sm">
          <Info size={20} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-amber-900">
            Important Note
          </h3>
          <p className="mt-1 text-xs leading-6 text-amber-800/80">
            This information is for educational purposes. Confirm disease diagnosis before applying any treatment.
          </p>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-start">
        <Link
          to="/plants"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800 hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          Back to Plant Categories
          <ArrowUpRight size={16} />
        </Link>
      </div>

    </div>
  );
}

export default PlantDetails;
