
import { useState } from "react";
import {
  Sprout,
  Search,
  Leaf,
  AlertTriangle,
  Eye,
  Plus,
  ArrowUpRight,
  Activity,
  Flower2,
} from "lucide-react";

function Plants() {
  const [search, setSearch] = useState("");

  const plants = [
    {
      id: 1,
      name: "Healthy",
      category: "Healthy Tomato Leaf",
      health: "Healthy",
      description:
        "The tomato leaf is healthy and shows no visible disease symptoms.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-healthy-plantvillage.webp",
    },
    {
      id: 2,
      name: "Early Blight",
      category: "Fungal Disease",
      health: "Diseased",
      description:
        "Causes brown spots with circular ring patterns on tomato leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-early-blight-plantvillage.webp",
    },
    {
      id: 3,
      name: "Late Blight",
      category: "Fungal Disease",
      health: "Diseased",
      description:
        "Causes dark, water-soaked patches on tomato leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-late-blight-plantvillage.webp",
    },
    {
      id: 4,
      name: "Bacterial Spot",
      category: "Bacterial Disease",
      health: "Diseased",
      description:
        "Produces small dark spots on tomato leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-bacterial-spot-plantvillage.webp",
    },
    {
      id: 5,
      name: "Septoria Leaf Spot",
      category: "Fungal Disease",
      health: "Diseased",
      description:
        "Appears as small circular spots with dark borders on leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-septoria-plantvillage.webp",
    },
    {
      id: 6,
      name: "Leaf Mold",
      category: "Fungal Disease",
      health: "Diseased",
      description:
        "Creates yellow patches and mold growth on tomato leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-leaf-mold-plantvillage.webp",
    },
    {
      id: 7,
      name: "Target Spot",
      category: "Fungal Disease",
      health: "Diseased",
      description:
        "Forms brown circular lesions with target-like patterns.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-target-spot-plantvillage.webp",
    },
    {
      id: 8,
      name: "Spider Mites",
      category: "Pest Damage",
      health: "Diseased",
      description:
        "Causes tiny yellow spots and damage to tomato leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-spider-mites-plantvillage.webp",
    },
    {
      id: 9,
      name: "Tomato Mosaic Virus",
      category: "Viral Disease",
      health: "Diseased",
      description:
        "Causes mosaic-like light and dark green patterns on leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-mosaic-plantvillage.webp",
    },
    {
      id: 10,
      name: "Tomato Yellow Leaf Curl Virus",
      category: "Viral Disease",
      health: "Diseased",
      description:
        "Causes yellowing and curling of tomato leaves.",
      image:
        "https://tomatoanswers.com/wp-content/uploads/2026/09/tomato-leaf-yellow-leaf-curl-plantvillage.webp",
    },
  ];

  const filteredPlants = plants.filter((plant) =>
    `${plant.name} ${plant.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const healthyCount = plants.filter(
    (plant) => plant.health === "Healthy"
  ).length;

  const diseasedCount = plants.filter(
    (plant) => plant.health === "Diseased"
  ).length;

  const summary = [
    {
      title: "Total Categories",
      value: plants.length,
      icon: Sprout,
      color: "bg-emerald-50 text-emerald-700",
      accent: "from-emerald-500 to-green-400",
      description: "Available plant categories",
    },
    {
      title: "Healthy Categories",
      value: healthyCount,
      icon: Leaf,
      color: "bg-lime-50 text-lime-700",
      accent: "from-lime-500 to-green-400",
      description: "Healthy leaf category",
    },
    {
      title: "Disease Categories",
      value: diseasedCount,
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-600",
      accent: "from-orange-500 to-amber-400",
      description: "Categories needing attention",
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-8 pb-6">

      {/* Premium Header */}
      <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#073b2b] via-[#086044] to-[#159568] px-6 py-8 text-white shadow-xl shadow-green-950/10 sm:px-9 sm:py-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-white/[0.06]" />
        <div className="absolute -bottom-24 right-36 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="absolute right-8 top-8 hidden opacity-[0.08] sm:block">
          <Flower2 size={180} strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-lime-100">
            <Sprout size={15} />
            PLANT MANAGEMENT
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Plants
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-green-50/85 sm:text-base">
            Explore tomato plant health categories and learn about
            common diseases, symptoms and leaf conditions.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur-sm">
              <Leaf size={17} className="text-lime-300" />
              {plants.length} Plant Categories
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-bold text-green-950">
              <Activity size={17} />
              Plant Health Overview
            </div>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Plant Summary
            </h2>
          </div>
          <p className="ml-3 mt-1 text-sm text-gray-500">
            A quick overview of your plant categories
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {summary.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/[0.06]"
              >
                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${item.accent}`} />

                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl p-3.5 ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-gray-300 transition-colors group-hover:text-emerald-600"
                  />
                </div>

                <p className="mt-5 text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h3 className="mt-1 text-3xl font-bold tracking-tight text-gray-800">
                  {item.value}
                </h3>

                <p className="mt-2 text-xs text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Search Section */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Find a Plant Category
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search by plant disease or category name
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
            <Search size={20} className="shrink-0 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tomato diseases..."
              className="w-full bg-transparent py-3.5 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Clear
              </button>
            )}
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-3.5 text-center text-sm font-semibold text-emerald-800">
            {filteredPlants.length} Results
          </div>
        </div>
      </section>

      {/* Disease Cards */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-gray-800">
                Tomato Disease Categories
              </h2>
            </div>
            <p className="ml-3 mt-1 text-sm text-gray-500">
              Explore plant conditions and disease information
            </p>
          </div>

          <span className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 shadow-sm">
            {filteredPlants.length} categories found
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/[0.07]"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-emerald-50">
                <img
                  src={plant.image}
                  alt={plant.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md ${
                    plant.health === "Healthy"
                      ? "bg-emerald-100/95 text-emerald-800"
                      : "bg-orange-100/95 text-orange-800"
                  }`}
                >
                  {plant.health === "Healthy" ? "Healthy" : "Disease"}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-semibold tracking-wide text-white drop-shadow-md">
                    TOMATO PLANT
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug text-gray-800 transition-colors group-hover:text-emerald-800">
                      {plant.name}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-gray-400">
                      {plant.category}
                    </p>
                  </div>

                  <div className={`shrink-0 rounded-xl p-2 ${
                    plant.health === "Healthy"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    {plant.health === "Healthy" ? (
                      <Leaf size={19} />
                    ) : (
                      <AlertTriangle size={19} />
                    )}
                  </div>
                </div>

                <p className="mt-4 min-h-[60px] text-sm leading-6 text-gray-500">
                  {plant.description}
                </p>

                <button
                  onClick={() => {
                    window.location.href = `/plant-details?disease=${encodeURIComponent(plant.name)}`;
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 py-3 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-700 hover:text-white"
                >
                  <Eye size={18} />
                  View Details
                  <ArrowUpRight size={16} className="ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Search size={25} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-800">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try searching with a different plant or disease name.
            </p>

            <button
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Plants;
