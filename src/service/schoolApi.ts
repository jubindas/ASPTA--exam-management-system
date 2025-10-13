import { axiosInstance } from "@/lib/axios";

export const getSchools = async () => {
  try {
    const response = await axiosInstance.get("/schools");

    if (response.status !== 200) {
      throw new Error("Error fetching Schools. Please try again.");
    }

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

    if (response.status !== 201) {
      throw new Error("Error Creating School. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSchool = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/schools/${id}`);

    if (response.status !== 200) {
      throw new Error("Error delete school. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSchool = async (
  id: number,
  schoolData: {
    center_name: string;
    subdivision_id: number;
    block_id: number;
  }
) => {
  try {
    const response = await axiosInstance.put(`/schools/${id}`, schoolData);

    if (response.status !== 200) {
      throw new Error("Error update school. Please try again.");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating school:", error);
    throw error; // re-throw so callers can handle it
  }
};
