import { axiosInstance } from "@/lib/axios";

export const fetchSubDivisions = async () => {
  try {
    const response = await axiosInstance.get("/subdivisions");

    if (response.status !== 200) {
      throw new Error("Error fetching Sub Division. Please try again.");
    }

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

    if (response.status !== 201) {
      throw new Error("Error creating Sub Division . Please try again.");
    }

    return response.data;
  } catch (error) {
    console.error("Error creating subdivision:", error);
    throw error;
  }
};

export const updateSubDivision = async (
  id: number,
  subDivision: { name: string }
) => {
  try {
    const response = await axiosInstance.put(
      `/subdivisions/${id}`,
      subDivision
    );

    if (response.status !== 200) {
      throw new Error("Error Updating Sub Division. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.error("Error updating subdivision:", error);
    throw error;
  }
};

export const deleteSubDivision = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/subdivisions/${id}`);

    if (response.status !== 200) {
      throw new Error("Error Delete Sub Division. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.error("Error deleting subdivision:", error);
    throw error;
  }
};

interface UpdatePasswordPayload {
  user_id: number;
  old_password: string;
  new_password: string;
}

export const updateSubdivisionPassword = async (
  payload: UpdatePasswordPayload,
  token: string | null
) => {
  try {
    const response = await axiosInstance.post(
      "/subdivisions/change-password",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Error Updating Password. Please try again.");
    }

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
