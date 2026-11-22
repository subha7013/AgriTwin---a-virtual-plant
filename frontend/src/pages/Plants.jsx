import { useEffect, useState } from "react";
import { Sprout, Search, Leaf, AlertTriangle, Eye } from "lucide-react";
import { getDiseases } from "../services/plantService";
import { getErrorMessage } from "../services/api";

function Plants() {
  const [search, setSearch] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDiseases() {
      try {
        const data = await getDiseases();
        if (active) setDiseases(data);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDiseases();

    return () => {
      active = false;
    };
  }, []);

  const plants = diseases.map((disease) => ({
    id: disease._id,
    name: disease.displayName,
    category: disease.category,
    health: disease.isHealthy ? "Healthy" : "Diseased",
    description: disease.description,
    image: disease.referenceImage,
  }));

  const term = search.trim().toLowerCase();

  const filteredPlants = plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(term) ||
      plant.category.toLowerCase().includes(term)
  );

  const healthyCount = plants.filter((plant) => plant.health === "Healthy").length;
  const diseasedCount = plants.filter((plant) => plant.health === "Diseased").length;

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Plants 🌱
        </h1>
        <p className="text-gray-500 mt-2">
          Explore tomato plants and their disease categories.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Categories</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? "—" : plants.length}
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
                {loading ? "—" : healthyCount}
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
                {loading ? "—" : diseasedCount}
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

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>
      )}

      {/* Disease Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Tomato Disease Categories
          </h2>

          <span className="text-sm text-gray-500">
            {loading ? "Loading..." : `${filteredPlants.length} categories found`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative flex items-center justify-center overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-800/40 pointer-events-none -z-0">
                  <Leaf size={46} />
                  <span className="text-[10px] font-bold mt-1 text-emerald-800/60 uppercase tracking-widest">
                    Solanum lycopersicum
                  </span>
                </div>
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

        {!loading && filteredPlants.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            No disease categories found.
          </div>
        )}

      </div>

    </div>
  );
}

export default Plants;