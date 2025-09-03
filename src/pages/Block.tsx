import { DataTable } from "@/components/data-table";
import { columns } from "@/table-columns/block-table-columns";
import { students } from "@/table-data/block-table-data";
import BlockDialog from "@/components/BlockDialog";

export default function Block() {
  return (
    <div className="p-6 bg-zinc-100 mt-8">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Block List
        </h1>
        <BlockDialog />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Entries Selector */}
        <div className="flex items-center gap-2 text-sm text-zinc-700">
          <span className="font-medium">Show</span>
          <select className="rounded-md px-3 py-2 bg-white border border-zinc-300 shadow-sm hover:border-zinc-400 transition-colors">
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="font-medium">entries</span>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 text-sm text-zinc-700">
          <span className="font-medium">Search:</span>
          <input
            type="text"
            placeholder="Type to search..."
            className="border border-zinc-300 rounded-md px-3 py-2 bg-white text-zinc-800 placeholder-zinc-400 shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition-all w-64"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <DataTable columns={columns} data={students} enablePagination={true} />
      </div>
    </div>
  );
}
