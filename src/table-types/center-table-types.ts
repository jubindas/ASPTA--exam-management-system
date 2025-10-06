export interface Center {
  id: number;
  center_name: string;
  block: {
    id: number;
    name: string;
    email: string;
    password: string;
    subdivision_id: number;
    created_at: string;
    updated_at: string;
  };
  subdivision: {
    id: number;
    name: string;
    email: string;
    password: string;
    student_counter: number;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}
