
import { useState } from "react";
import {
  Sprout,
  Search,
  Leaf,
  AlertTriangle,
  Eye,
  Plus,
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
    plant.name.toLowerCase().includes(search.toLowerCase())
  );

  const healthyCount = plants.filter(
    (plant) => plant.health === "Healthy"
  ).length;

  const diseasedCount = plants.filter(
    (plant) => plant.health === "Diseased"
  ).length;

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Plants 🌱
          </h1>
          <p className="text-gray-500 mt-2">
            Explore tomato plants and their disease categories.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl shadow-md transition">
          <Plus size={19} />
          Add New Plant
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Categories</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {plants.length}
              </h2>
            </div>
            <div className="p-3 bg-green-100 rounded-xl text-green-700">
              <Sprout size={27} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Healthy Categories</p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {healthyCount}
              </h2>
            </div>
            <div className="p-3 bg-lime-100 rounded-xl text-lime-700">
              <Leaf size={27} />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Disease Categories</p>
              <h2 className="text-3xl font-bold text-orange-600 mt-2">
                {diseasedCount}
              </h2>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <AlertTriangle size={27} />
            </div>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4">
          <Search size={20} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tomato diseases..."
            className="w-full py-3 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Disease Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Tomato Disease Categories
          </h2>

          <span className="text-sm text-gray-500">
            {filteredPlants.length} categories found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition"
            >
              <div className="h-48 bg-green-50">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">

                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {plant.name}
                  </h3>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      plant.health === "Healthy"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {plant.health}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {plant.category}
                </p>

                <p className="text-sm text-gray-600 mt-3 min-h-12">
                  {plant.description}
                </p>

                <button
                  onClick={() => {
                    window.location.href = `/plant-details?disease=${encodeURIComponent(plant.name)}`;
                  }}
                  className="w-full flex items-center justify-center gap-2 mt-5 border border-green-700 text-green-700 hover:bg-green-700 hover:text-white py-2.5 rounded-xl font-semibold transition"
                >
                  <Eye size={18} />
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>

        {filteredPlants.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            No disease categories found.
          </div>
        )}

      </div>

    </div>
  );
}

export default Plants;
