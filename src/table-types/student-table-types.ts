export interface Student {
  id: number;
  student_id: string;
  student_name: string;
  guardian_name: string;
  phone: string;
  class: string;
  medium: string;
  subdivision?: {
    id: number;
    name: string;
  };
  block?: {
    id: number;
    name: string;
    subdivision_id: number;
  };
  school?: {
    id: number;
    block_id: number;
    center_name: string;
    subdivision_id: number;
  };
  gender: string;
}
