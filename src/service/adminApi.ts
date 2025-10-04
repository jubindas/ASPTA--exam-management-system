import { axiosInstance } from "@/lib/axios";

export const AdminLogin = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post("/auth/admin/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

