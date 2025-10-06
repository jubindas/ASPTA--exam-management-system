import { axiosInstance } from "@/lib/axios";

export const getBlockList = async () => {
  try {
    const response = await axiosInstance.get("/blocks");
    console.log(response)
    console.log(response.data)
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
    console.log("📤 Sending block payload:", blockData);

    const response = await axiosInstance.post("/blocks", blockData);

    console.log("Received response", response);

    return response.data;
  } catch (error) {
    
    console.error(" Full error object:", error);
    throw error; 
  }
};
