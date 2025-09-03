import type { Center } from "@/table-types/center-table-types";

export const schools: Center[] = JSON.parse(localStorage.getItem("centers") || "[]");
