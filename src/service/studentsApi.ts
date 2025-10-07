import { axiosInstance } from "@/lib/axios";
import type { Student } from "@/table-types/student-table-types";

export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await axiosInstance.get("/students");
    const students = response.data.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return students.map((s: any) => ({
      id: s.id,
      uuid: s.student_id,
      name: s.student_name,
      guardianName: s.guardian_name,
      mobile: s.phone,
      studentClass: s.class,
      medium: s.medium,
      subDivision: s.subdivision?.name || "",
      block: s.block?.name || "",
      centerName: s.school?.center_name || "",
    }));
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
