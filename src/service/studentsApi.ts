import { axiosInstance } from "@/lib/axios";

export const getStudents = async () => {
  try {
    const response = await axiosInstance.get(`/students`);
    console.log("the datas are studens", response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createStudent = async (studentData: {
  student_name: string;
  guardian_name: string;
  phone: string;
  class: string;
  medium: string;
  subdivision_id: number;
  block_id: number;
  school_id: number;
  gender: string;
}) => {
  try {
    const response = await axiosInstance.post("/students", studentData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateStudent = async (
  studentId: number,
  studentData: {
    student_name?: string;
    guardian_name?: string;
    phone?: string;
    class?: string;
    medium?: string;
    subdivision_id?: number;
    block_id?: number;
    school_id?: number;
    gender: string;
  }
) => {
  try {
    const response = await axiosInstance.put(
      `/students/${studentId}`,
      studentData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update student:", error);
    throw error;
  }
};

export const deleteStudent = async (studentId: number) => {
  try {
    const response = await axiosInstance.delete(`/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw error;
  }
};
