import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/service/dashboardApi";
import { School, Layers, Users, MapPin } from "lucide-react";
import Loader from "@/components/Loader";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">Failed to load data</div>
    );

  const stats = data?.data || {};

  const dashboardCards = [
    {
      title: "Total Schools",
      value: stats.total_schools || 0,
      icon: <School className="w-8 h-8 text-blue-500" />,
      color: "blue",
    },
    {
      title: "Total Subdivisions",
      value: stats.total_subdivisions || 0,
      icon: <Layers className="w-8 h-8 text-green-500" />,
      color: "green",
    },
    {
      title: "Total Students",
      value: stats.total_students || 0,
      icon: <Users className="w-8 h-8 text-purple-500" />,
      color: "purple",
    },
    {
      title: "Total Blocks",
      value: stats.total_blocks || 0,
      icon: <MapPin className="w-8 h-8 text-red-500" />,
      color: "red",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">AAPTA Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className={`bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 transform hover:scale-105 transition-transform`}
          >
            <div className="p-4 bg-gray-100 rounded-full flex items-center justify-center">
              {card.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-600">
                {card.title}
              </h2>
              <p className={`text-3xl font-bold mt-1 text-${card.color}-600`}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Recent Subdivisions
        </h2>
        {data?.recent_subdivisions && data.recent_subdivisions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recent_subdivisions.map((subdiv: string, index: number) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition-shadow"
              >
                <h3 className="font-semibold text-gray-700">{subdiv}</h3>
                <p className="text-gray-500 text-sm">No description</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent subdivisions.</p>
        )}
      </div>
    </div>
  );
}
