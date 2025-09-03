// storeCredentials.ts
export interface User {
  email: string;
  password: string;
  role: "admin" | "subdiv";
}
export function saveTestCredentials() {
  const users: User[] = [
    { email: "admin@abc.com", password: "admin123", role: "admin" },
    { email: "subdivi@abc.com", password: "subdiv123", role: "subdiv" },
  ];

  const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  const mergedUsers = [...existingUsers, ...users];

  localStorage.setItem("users", JSON.stringify(mergedUsers));
}
