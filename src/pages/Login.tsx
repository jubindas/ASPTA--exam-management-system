import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { AdminLogin } from "@/service/adminApi";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutationLogin = useMutation({
    mutationFn: (data: { email: string; password: string }) => AdminLogin(data),
    onSuccess: (data) => {
      console.log("Login successful:", data);

      const { user, token, user_type } = data;
      console.log(user_type);

      if (!user || !token) {
        console.error("⚠️ Missing user or token in response");
        alert("Unexpected response format. Please contact support.");
        return;
      }
      const fullUser = { ...user, user_type };

      login(fullUser, token);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutationLogin.mutate({ email, password });
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
              <Mail
                className="absolute left-3 top-2.5 text-zinc-400"
                size={16}
              />
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
              <Lock
                className="absolute left-3 top-2.5 text-zinc-400"
                size={16}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-800 text-white py-2 rounded-md hover:bg-zinc-900 transition-colors"
            disabled={mutationLogin.isPending}
          >
            {mutationLogin.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
