import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/table-columns/block-table-columns";
import BlockDialog from "@/components/BlockDialog";
import { useNavigate } from "react-router-dom";
import type { Block } from "@/table-types/block-table-types"; // ✅ shared type

export default function Block() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const storedBlocks = JSON.parse(localStorage.getItem("blocks") || "[]");
    setBlocks(storedBlocks);
  }, []);

  const handleBlocksChange = (updatedBlocks: Block[]) => {
    setBlocks(updatedBlocks);
  };

  return (
    <div className="p-6 bg-zinc-100 mt-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 tracking-tight">
          Block List
        </h1>
        <BlockDialog onBlocksChange={handleBlocksChange} />
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Show Entries + Search */}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <DataTable<Block, unknown>
          columns={columns(navigate)}
          data={blocks}
          enablePagination={true}
        />
      </div>
    </div>
  );
}
