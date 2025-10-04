import { axiosInstance } from "@/lib/axios";

export const fetchSubDivisions = async () => {
  try {
    const response = await axiosInstance.get(
      "/subdivisions"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subdivisions:", error);
    throw error;
  }
};
