export interface Block {
  id: number;
  name: string;
  email: string;
  password: string;
  subdivision_id: number;
  subdivision: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    password: string;
    student_counter: number;
  };
}
