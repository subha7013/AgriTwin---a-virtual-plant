
import { Leaf, Sprout, Activity, AlertTriangle } from "lucide-react";

function Dashboard() {
  const stats = [
    { title: "Total Plants", value: "120", icon: Sprout },
    { title: "Healthy Plants", value: "95", icon: Leaf },
    { title: "Diseased Plants", value: "25", icon: AlertTriangle },
    { title: "Active Sensors", value: "12", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">
          AgriTwin Dashboard 🌱
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to your smart agriculture monitoring system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl shadow-md border border-green-100"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-gray-600 font-medium">
                  {item.title}
                </h2>
                <Icon size={28} className="text-green-600" />
              </div>

              <p className="text-3xl font-bold text-green-800 mt-5">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
