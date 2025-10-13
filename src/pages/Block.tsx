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
     <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Block List
        </h1>
        <BlockDialog mode="create" />
      </div>

     
        {filteredBlockData && (
          <DataTable
            columns={columns()}
            data={filteredBlockData}
            enablePagination={true}
            filterOptions={{
              enableFilter: true,
              filterPlaceholder: "Search blocks...",
              filterCol: "name",
            }}
          />
        )}
    
    </div>
  );
}
