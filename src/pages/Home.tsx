export default function Home() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        AAPTA Dashboard
      </h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Schools</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">120</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Subdivisions</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">15</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Students</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">12,500</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Blocks</h2>
          <p className="text-3xl font-bold text-red-600 mt-2">50</p>
        </div>
      </div>
    </div>
  );
}
