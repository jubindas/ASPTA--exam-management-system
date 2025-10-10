import { DataTable } from "@/components/data-table";

import { columns } from "@/table-columns/block-table-columns";

import BlockDialog from "@/components/BlockDialog";
import type { Block } from "@/table-types/block-table-types";
import { getBlockList } from "@/service/blockApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";

export default function Block() {
  const { user, loading } = useAuth();

  const { data: blockData, isLoading } = useQuery({
    queryKey: ["blocks"],
    queryFn: getBlockList,
  });

  const filteredBlockData = blockData?.filter((b: Block) => {
    if (!user) return true;

    if (user.user_type === "subdivision") {
      return b.subdivision?.name === user.name;
    }
    return true;
  });

  if (loading) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 bg-zinc-100 mt-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-800 tracking-tight">
          Block List
        </h1>
       
      </div>

   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-700 mt-2 sm:mt-0">
          <span className="font-medium">Search:</span>
          <input
            type="text"
            placeholder="Type to search..."
            className="border border-zinc-300 rounded-md px-3 py-2 bg-white text-zinc-800 placeholder-zinc-400 shadow-sm focus:ring-2 focus:ring-zinc-500 focus:outline-none transition-all w-full sm:w-64"
          />
        </div>
         <BlockDialog mode="create" />
      </div>

     
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {filteredBlockData && (
          <DataTable<Block, unknown>
            columns={columns()}
            data={filteredBlockData}
            enablePagination
          />
        )}
      </div>
    </div>
  );
}
