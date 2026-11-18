
import { Sprout, Leaf, AlertTriangle } from "lucide-react";

function Plants() {
  const plants = [
    {
      id: "PL001",
      name: "Tomato Plant 1",
      type: "Tomato",
      health: "Healthy",
      status: "healthy",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600",
    },
    {
      id: "PL002",
      name: "Tomato Plant 2",
      type: "Tomato",
      health: "Diseased",
      status: "diseased",
      image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600",
    },
    {
      id: "PL003",
      name: "Tomato Plant 3",
      type: "Tomato",
      health: "Healthy",
      status: "healthy",
      image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800">
          Plant Details 🌱
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your plant information.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden"
          >
            <img
              src={plant.image}
              alt={plant.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <Sprout size={30} className="text-green-600" />

                {plant.status === "healthy" ? (
                  <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
                    <Leaf size={15} />
                    Healthy
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                    <AlertTriangle size={15} />
                    Diseased
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {plant.name}
              </h2>

              <p className="text-gray-500 mt-2">
                Plant ID: {plant.id}
              </p>

              <p className="text-gray-500 mt-1">
                Plant Type: {plant.type}
              </p>

              <div className="mt-5 border-t pt-4">
                <p className="text-sm text-gray-600">
                  Health Status: <strong>{plant.health}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plants;
