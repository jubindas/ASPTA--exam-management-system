import type { SubDivision } from "@/table-types/sub-division-types";

export const subdivisions: SubDivision[] =
  JSON.parse(localStorage.getItem("subDivisions") || "[]");
