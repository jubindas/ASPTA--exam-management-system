import { axiosInstance } from "@/lib/axios";



export const fetchSubDivisions = async () => {
  try {
    const response = await axiosInstance.get("/subdivisions");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subdivisions:", error);
    throw error;
  }
};

export const createSubDivision = async (subDivision: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/subdivisions", subDivision);
    return response.data;
  } catch (error) {
    console.error("Error creating subdivision:", error);
    throw error;
  }
};


export const updateSubDivision = async (id: number, subDivision: { name: string }) => {
  try {
    const response = await axiosInstance.put(`/subdivisions/${id}`, subDivision);
    return response.data;
  } catch (error) {
    console.error("Error updating subdivision:", error);
    throw error;
  }
};


export const deleteSubDivision = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/subdivisions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting subdivision:", error);
    throw error;
  }
};



export interface UpdatePasswordData {
  old_password: string;
  new_password: string;
}


export const updateSubdivisionPassword = async (
  data: UpdatePasswordData,
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      "/subdivisions/change-password",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update subdivision password:", error);
 
  }
};
