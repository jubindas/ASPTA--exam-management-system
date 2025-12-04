import { axiosInstance } from "@/lib/axios";

export const getStudents = async (page?: number, perPage?: number) => {
  const url =
    page && perPage
      ? `/students?page=${page}&per_page=${perPage}`
      : `/students`;

  try {
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error("Error fetching students. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.log(error);

    return {
      data: [],
      pagination: {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: perPage,
      },
    };
  }
};

export const getStudentsBySubDiv = async (id: number) => {
  try {
    const response = await axiosInstance.get(`subdivisions/${id}/students`);
    if (response.status !== 200) {
      throw new Error("Error fetching students. Please try again.");
    }

    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStudentsByBlock = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/blocks/${id}/students`);

    if (response.status !== 200) {
      throw new Error("Error fetching students. Please try again.");
    }

    console.log("the datas are backend", response.data.data);

    return response.data.data;
  } catch (error) {
    console.log(error);
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
  gender?: string;
}) => {
  try {
    const response = await axiosInstance.post("/students", studentData);

    if (response.status !== 201) {
      throw new Error("Error creating new student. Please try again.");
    }

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

    if (response.status !== 200) {
      throw new Error("Error Updating students. Please try again.");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to update student:", error);
    throw error;
  }
};

export const deleteStudent = async (studentId: number) => {
  try {
    const response = await axiosInstance.delete(`/students/${studentId}`);

    if (response.status !== 200) {
      throw new Error("Error Delete student. Please try again.");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw error;
  }
};
