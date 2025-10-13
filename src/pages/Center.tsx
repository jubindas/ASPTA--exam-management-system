import { DataTable } from "@/components/data-table";

import { columns } from "@/table-columns/center-table-columns";

import { getSchools } from "@/service/schoolApi";

import { useQuery } from "@tanstack/react-query";

import CenterDialog from "@/components/CenterDialog";

import { useAuth } from "@/hooks/useAuth";

import Loader from "@/components/Loader";

interface Center {
  id: number;
  subDivision: string;
  block: string;
  centerName: string;
}

export default function Center() {
  const { data: schools, isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  console.log("the schools are ", schools);

  const { user, loading } = useAuth();

  const filteredSchools = schools?.filter(
    (s: { subdivision: { name: string }; block: { name: string } }) => {
      if (!user) return true;

      if (user.user_type === "subdivision") {
        return s.subdivision?.name === user.name;
      }

      if (user.user_type === "block") {
        return s.block?.name === user.name;
      }

      return true;
    }
  );

  if (loading) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-zinc-100 min-h-screen mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          School Lists
        </h1>

        <CenterDialog mode="create" />
      </div>

      {schools && (
        <DataTable
          columns={columns()}
          data={filteredSchools}
          enablePagination={true}
          filterOptions={{
            enableFilter: true,
            filterPlaceholder: "Search Schools...",
            filterCol: "center_name",
          }}
        />
      )}
    </div>
  );
}
