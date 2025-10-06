import { axiosInstance } from "@/lib/axios";

export const getSchools = async () => {
  try {
    const response = await axiosInstance.get("/schools");
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const createSchools = async (schoolData: {
  center_name: string;
  subdivision_id: number;
  block_id: number;
}) => {
  try {
    const response = await axiosInstance.post("/schools", schoolData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSchool = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/schools/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
