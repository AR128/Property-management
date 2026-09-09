import { Link, Outlet, useLocation } from "react-router";

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a131c] bg-[radial-gradient(circle_at_80%_0%,#143547_0,transparent_45%)] text-[#e5f0ee] font-sans">
      {/* Header Navigation */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between border-b border-[#1c3547]/60 px-4 py-5 sm:px-8">
        <Link
          className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-[#00c9a7] no-underline transition hover:opacity-90"
          to="/"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00c9a7]/15 text-xl">
            🏛️
          </span>
          <span>Estara Real Estate</span>
        </Link>
        <nav className="flex items-center gap-3 font-semibold">
          <Link
            className={`rounded-xl px-4 py-2 text-sm no-underline transition ${
              location.pathname === "/login"
                ? "bg-[#00c9a7] text-black shadow-lg shadow-[#00c9a7]/20 font-bold"
                : "text-[#9cb6c9] hover:bg-[#152e42] hover:text-white"
            }`}
            to="/login"
          >
            Log in
          </Link>
          <Link
            className={`rounded-xl px-4 py-2 text-sm no-underline transition ${
              location.pathname === "/signup"
                ? "bg-[#00c9a7] text-black shadow-lg shadow-[#00c9a7]/20 font-bold"
                : "border border-[#22455e] text-[#e5f0ee] hover:border-[#00c9a7] hover:text-white"
            }`}
            to="/signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="grid items-center gap-10 md:min-h-[65vh] md:grid-cols-[1.1fr_1fr] md:gap-14">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00c9a7]/30 bg-[#00c9a7]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00c9a7]">
              ✨ Premier Property Portal
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Dream Home or Sell Real Estate with Verified Confidence.
            </h1>
            {location.pathname === "/" && (
              <>
                <p className="text-base leading-relaxed text-[#9cb6c9]">
                  Estara connects buyers with verified property sellers. Explore luxury apartments, villas, plots, and commercial spaces verified by our admin team.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/login"
                    className="rounded-xl bg-[#00c9a7] px-6 py-3.5 text-sm font-extrabold text-black shadow-xl shadow-[#00c9a7]/20 transition hover:-translate-y-0.5 hover:bg-[#12dbb8] no-underline"
                  >
                    Browse Marketplace →
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-xl border border-[#22455e] bg-[#11222e]/80 px-6 py-3.5 text-sm font-bold text-[#e5f0ee] transition hover:border-[#00c9a7] hover:text-white no-underline"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 border-t border-[#1c3547] pt-6">
                  <div>
                    <span className="block text-2xl font-extrabold text-white">100%</span>
                    <span className="text-xs text-[#82a3b8]">Verified Sellers</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-extrabold text-[#00c9a7]">Direct</span>
                    <span className="text-xs text-[#82a3b8]">Owner Contacts</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-extrabold text-amber-400">Zero</span>
                    <span className="text-xs text-[#82a3b8]">Fake Listings</span>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Form Container Outlet */}
          <section className="w-full">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
