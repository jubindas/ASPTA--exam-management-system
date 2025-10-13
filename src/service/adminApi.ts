import { axiosInstance } from "@/lib/axios";

interface LoginData {
  email: string;
  password: string;
}

export const AdminLogin = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post("/auth/admin/login", data);
    console.log("Admin login success:", response.data);
    return response.data;
  } catch (error) {
    console.warn("Admin login failed, trying subdivision...");
    console.log("the error is", error);
  }

  try {
    const response = await axiosInstance.post("/auth/subdivision/login", data);
    console.log("Subdivision login success:", response.data);
    return response.data;
  } catch (error) {
    console.warn("Subdivision login failed, trying block...");
    console.log("the error is", error);
  }

  try {
    const response = await axiosInstance.post("/auth/block/login", data);
    console.log("Block login success:", response.data);
    return response.data;
  } catch (error) {
    console.error("All logins failed.");
    console.log("the error is", error);
  }
};
