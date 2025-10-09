import { axiosInstance } from "@/lib/axios";

export const getBlockList = async () => {
  try {
    const response = await axiosInstance.get("/blocks");
    return response.data.data;
  } catch (error) {
    console.log("the err", error);
  }
};

export const createBlock = async (blockData: {
  name: string;
  email: string;
  subdivision_id: number;
  password: string;
}) => {
  try {
  

    const response = await axiosInstance.post("/blocks", blockData);

    return response.data;
  } catch (error) {
    console.error(" Full error object:", error);
    throw error;
  }
};

export const updateBlock = async (
  id: number,
  blockData: {
    name?: string;
    email?: string;
    subdivision_id?: number;
    password?: string;
  }
) => {
  try {
    console.log(`Updating block with ID ${id}:`, blockData);

    const response = await axiosInstance.put(`/blocks/${id}`, blockData);

    console.log("Update response:", response);

    return response.data;
  } catch (error) {
    console.error("Error updating block:", error);
    throw error;
  }
};

export const deleteBlock = async (id: number) => {
  try {
    console.log(`Deleting block with ID ${id}`);
    const response = await axiosInstance.delete(`/blocks/${id}`);
    console.log("Delete response:", response);
    return response.data;
  } catch (error) {
    console.error("Error deleting block:", error);
    throw error;
  }
};



interface UpdatePasswordPayload {
  user_id: number;
  old_password: string;
  new_password: string;
}

export const updateBlockPassword = async (
  payload: UpdatePasswordPayload,
  token: string | null,
) => {
  try {
    const response = await axiosInstance.post(
      "/blocks/change-password",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Failed to update subdivision password:",
      error.response?.data || error.message
    );
    throw error;
  }
};
