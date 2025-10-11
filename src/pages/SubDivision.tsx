import { DataTable } from "@/components/data-table";

import { getColumns } from "@/table-columns/sub-division-table-columns";

import { useQuery } from "@tanstack/react-query";

import { fetchSubDivisions } from "@/service/subDivisionApi";

import SubDivisionDialog from "@/components/SubDivisionDialog";

import type { SubDivision } from "@/table-types/sub-division-types";

import Loader from "@/components/Loader";

export default function SubDivision() {
  const { data, isLoading } = useQuery({
    queryKey: ["subDivisions"],
    queryFn: fetchSubDivisions,
  });

  console.log("the sub division", data);

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Sub Division List
        </h1>

        <SubDivisionDialog mode="create" />
      </div>

      <DataTable
        columns={getColumns()}
        data={data || []}
        enablePagination={true}
        filterOptions={{
          enableFilter: true,
          filterPlaceholder: "Search Sub Divisions...",
          filterCol: "name",
        }}
      />
    </div>
  );
}
