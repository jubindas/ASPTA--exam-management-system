import { axiosInstance } from "@/lib/axios";

export const fetchDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard");

    if (response.status !== 200) {
      throw new Error("something wnet wrong");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
