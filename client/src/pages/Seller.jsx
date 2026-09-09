import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { fetchWithAuth } from "../utils/tokenStorage";
import { API_BASE_URL } from "../config/api";

const Seller = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSellerAccess = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/user/dashboard`, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok && data.user) {
          setUser(data.user);
          if (!data.user.role?.includes("seller")) {
            alert("Seller access required. Please register as a seller first.");
            navigate("/dashboard", { replace: true });
          }
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkSellerAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080E17] text-emerald-400">
        <div className="flex items-center gap-3 text-lg font-bold">
          <span className="h-4 w-4 rounded-full bg-emerald-500 animate-ping" />
          <span>Loading Seller Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080E17] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] px-4 pb-16 pt-6 text-slate-100 sm:px-8">
      {/* Navigation Header */}
      <header className="sticky top-4 z-40 mx-auto mb-10 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            className="flex items-center gap-2 text-xl font-black tracking-tight text-white no-underline"
            to="/seller/dashboard"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🏛️
            </span>
            <span>Estara <span className="text-emerald-400">Seller</span></span>
          </Link>
          <span className="hidden sm:inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            Partner Portal
          </span>
        </div>

        <nav className="flex items-center gap-2 text-xs font-bold sm:text-sm">
          <Link
            to="/seller/dashboard"
            className={`rounded-xl px-4 py-2.5 no-underline transition ${
              location.pathname === "/seller/dashboard"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            My Listings
          </Link>
          <Link
            to="/seller/items"
            className={`rounded-xl px-4 py-2.5 no-underline transition ${
              location.pathname === "/seller/items"
                ? "bg-linear-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"
            }`}
          >
            + Add Property
          </Link>
          <Link
            to="/dashboard"
            className="ml-2 rounded-xl border border-white/10 bg-slate-800/80 px-4 py-2.5 text-slate-300 no-underline transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-white"
          >
            Buyer Hub →
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
};

export default Seller;

