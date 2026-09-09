import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { setAccessToken } from "../utils/tokenStorage";
import { API_BASE_URL } from "../config/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.token);
        navigate("/dashboard", { replace: true });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-[#1e394f] bg-[#112230]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
        <p className="mt-1 text-xs text-[#9cb6c9]">Log in to access your property dashboard and listings.</p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-800/40 bg-red-950/40 p-3 text-xs font-semibold text-red-300">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
            className="w-full rounded-xl border border-[#22455e] bg-[#091724] px-4 py-3 text-sm text-white placeholder-[#5b7a91] outline-none transition focus:border-[#00c9a7] focus:ring-2 focus:ring-[#00c9a7]/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-[#22455e] bg-[#091724] px-4 py-3 text-sm text-white placeholder-[#5b7a91] outline-none transition focus:border-[#00c9a7] focus:ring-2 focus:ring-[#00c9a7]/20"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-[#00c9a7] py-3.5 text-sm font-extrabold text-black shadow-lg shadow-[#00c9a7]/20 transition hover:-translate-y-0.5 hover:bg-[#12dbb8]"
          >
            {loading ? "Authenticating..." : "Log In to Account"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-[#82a3b8]">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-[#00c9a7] hover:underline no-underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
