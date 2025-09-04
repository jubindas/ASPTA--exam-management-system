export interface User {
  name: string;
  email: string;
  password: string;
  role: "admin" | "subdiv";
}

export function saveTestCredentials() {
  const users: User[] = [
    {
      name: "Admin User",
      email: "admin@abc.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Test Subdivision",
      email: "subdivi@abc.com",
      password: "subdiv123",
      role: "subdiv",
    },
  ];

  const existingUsers: User[] = JSON.parse(
    localStorage.getItem("users") || "[]"
  );

  // Avoid duplicate emails
  const mergedUsers = [
    ...existingUsers.filter(
      (eu) => !users.some((u) => u.email === eu.email)
    ),
    ...users,
  ];

  localStorage.setItem("users", JSON.stringify(mergedUsers));
}
