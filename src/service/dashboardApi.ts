import { axiosInstance } from "@/lib/axios";

export const fetchDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
