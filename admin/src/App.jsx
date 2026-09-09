import { useState } from "react";
import { useNavigate } from "react-router";
import { setAccessToken } from "./utils/tokenStorage.js";

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminName: "",
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
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.token);
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(data.message || "Invalid Admin Credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080E17] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,245,212,0.12),rgba(255,255,255,0))] p-4 text-slate-100 sm:p-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-2xl">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="hidden bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 p-8 text-white md:flex md:flex-col md:justify-between border-r border-white/10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-teal-300">
                🏛️ Estara Moderation
              </span>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-white">Executive Command Center</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Full platform administration: Seller verification, property specs approval, and customer activity management.
              </p>
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              🔒 Strictly restricted to authorized Estara system administrators.
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mb-6 md:hidden">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-teal-400">
                🏛️ Estara Admin
              </span>
              <h2 className="text-xl font-bold text-white">Admin Console</h2>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-300">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Admin Username
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="admin"
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@estara.com"
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-xl bg-linear-to-r from-teal-400 to-cyan-400 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-teal-400/20 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Authenticating..." : "Sign In to Admin Console"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

