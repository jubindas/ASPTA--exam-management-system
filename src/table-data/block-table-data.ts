import type {Block} from "@/table-types/block-table-types"

export const students: Block[] = JSON.parse(localStorage.getItem("blocks") || "[]");