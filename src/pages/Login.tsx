import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

interface User {
  email: string;
  password: string;
  role: "admin" | "subdiv";
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (user.role === "admin") navigate("/");
      else if (user.role === "subdiv") navigate("/subdiv-dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-zinc-800 text-center mb-6">
          Welcome
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-700 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-zinc-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                required
              />
              <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-zinc-700 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full border border-zinc-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                required
              />
              <Lock className="absolute left-3 top-2.5 text-zinc-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-800 text-white py-2 rounded-md hover:bg-zinc-900 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
