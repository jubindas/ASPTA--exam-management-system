import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/service/dashboardApi";
import Loader from "@/components/Loader";

type Subdivision = {
  id: number;
  name: string;
  email?: string;
  student_counter?: number;
};

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

  const stats = data?.stats || {};
  const recent: Subdivision[] = data?.recent_subdivisions || [];

  const dashboardCards = [
    {
      title: "Total Schools",
      value: stats.total_schools ?? 0,
      color: "from-blue-300 to-blue-300",
    },
    {
      title: "Total Subdivisions",
      value: stats.total_subdivisions ?? 0,
      color: "from-green-300 to-green-300",
    },
    {
      title: "Total Students",
      value: stats.total_students ?? 0,
      color: "from-purple-300 to-purple-300",
    },
    {
      title: "Total Blocks",
      value: stats.total_blocks ?? 0,
      color: "from-red-300 to-red-300",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          AAPTA Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Overview of current statistics and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.03] transition-all duration-300`}
          >
            <h2 className="text-lg font-medium opacity-90 text-stone-950">{card.title}</h2>
            <p className="text-4xl font-extrabold mt-2 drop-shadow-sm text-stone-950">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Recent Subdivisions
          </h2>
          <p className="text-sm text-gray-500">
            Showing {recent.length} of {stats.total_subdivisions ?? "—"}
          </p>
        </div>

        {recent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {recent.map((subdiv) => (
              <div
                key={subdiv.id}
                className="bg-white backdrop-blur-sm shadow-md rounded-2xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {subdiv.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{subdiv.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">Students</p>
                    <p className="text-2xl font-bold text-gray-700">
                      {subdiv.student_counter ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    Active
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    ID: {subdiv.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No recent subdivisions.</p>
        )}
      </div>
    </div>
  );
}
