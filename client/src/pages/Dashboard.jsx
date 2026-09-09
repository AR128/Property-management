import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { clearAccessToken, fetchWithAuth } from "../utils/tokenStorage";
import ConsentModal from "../components/ConsentModal";
import PropertyDetailModal from "../components/PropertyDetailModal";
import { API_BASE_URL } from "../config/api";

const PROPERTY_TYPES = ["All", "Apartment", "Independent house", "Villa", "Plot", "Commercial"];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPurpose, setSelectedPurpose] = useState("All");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/user/dashboard`,
          { method: "GET" },
        );
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        }

        const propertiesResponse = await fetchWithAuth(
          `${API_BASE_URL}/user/properties`,
          { method: "GET" },
        );
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setProperties(propertiesData.properties || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadUser();
  }, [location.pathname]);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenuOnOutsideClick);
    return () =>
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
  }, []);

  useEffect(() => {
    const closeMenuOnEscape = (event) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    document.addEventListener("keydown", closeMenuOnEscape);
    return () => document.removeEventListener("keydown", closeMenuOnEscape);
  }, []);

  const handleLogout = () => {
    clearAccessToken();
    navigate("/", { replace: true });
  };

  const handleBecomeSellerClick = () => {
    setIsProfileMenuOpen(false);
    if (user?.role?.includes("seller")) {
      navigate("/seller/dashboard");
      return;
    }

    if (!user?.isVerified) {
      alert("Verification Required! Complete identity verification (Aadhaar & PAN) before becoming a seller.");
      navigate("/dashboard/verify");
      return;
    }

    setIsConsentModalOpen(true);
  };

  const handleConsentSuccess = (data) => {
    setIsConsentModalOpen(false);
    if (data.user) {
      setUser(data.user);
    } else {
      setUser((prev) => (prev ? { ...prev, role: [...(prev.role || []), "seller"] } : prev));
    }
    alert("Seller partner agreement accepted! Navigating to your seller dashboard.");
    navigate("/seller/dashboard");
  };

  const initials = user?.clientName?.slice(0, 1).toUpperCase() || "U";

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address?.state?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "All" || property.propertyType === selectedType;

    const matchesPurpose =
      selectedPurpose === "All" || property.purpose === selectedPurpose;

    return matchesSearch && matchesType && matchesPurpose;
  });

  return (
    <div className="min-h-screen bg-[#080E17] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] px-4 pb-16 pt-6 text-slate-100 sm:px-8">
      {/* Sticky Header */}
      <header className="sticky top-4 z-40 mx-auto mb-10 flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 shadow-2xl backdrop-blur-xl">
        <Link
          className="flex items-center gap-2 text-xl font-black tracking-tight text-white no-underline"
          to="/dashboard"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🏛️
          </span>
          <span>Estara <span className="text-emerald-400">Estate</span></span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-bold sm:text-sm">
          <Link to="/dashboard" className="text-slate-300 hover:text-white no-underline transition">
            Marketplace
          </Link>
          {user?.role?.includes("seller") && (
            <Link
              to="/seller/dashboard"
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 no-underline transition"
            >
              Seller Workspace →
            </Link>
          )}
        </div>
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            aria-label="Open profile menu"
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-slate-800/80 p-1.5 pr-4 text-left transition hover:border-emerald-500/50 focus:outline-none"
          >
            {user?.profilePicture?.url ? (
              <img
                className="h-9 w-9 rounded-full object-cover border border-emerald-500/40"
                src={user.profilePicture.url}
                alt={`${user.clientName} profile`}
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 font-black text-slate-950">
                {initials}
              </span>
            )}
            <span className="hidden max-w-32 truncate text-xs font-bold text-slate-200 sm:block">
              {user?.clientName || "Profile"}
            </span>
            <span className="text-[10px] text-slate-400">
              {isProfileMenuOpen ? "▲" : "▼"}
            </span>
          </button>
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl"
              role="menu"
            >
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-xs font-bold text-white truncate">{user?.clientName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link
                className="block rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 no-underline transition hover:bg-slate-800 hover:text-white"
                to="/dashboard/verify"
                onClick={() => setIsProfileMenuOpen(false)}
                role="menuitem"
              >
                Verification & Profile
              </Link>
              <button
                type="button"
                className="block w-full cursor-pointer rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10"
                onClick={handleBecomeSellerClick}
                role="menuitem"
              >
                {user?.role?.includes("seller")
                  ? "Seller Dashboard"
                  : "+ Become a Seller Partner"}
              </button>
              <button
                type="button"
                className="block w-full cursor-pointer rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                onClick={handleLogout}
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl">
        <section className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {user?.clientName
              ? `Welcome back, ${user.clientName}.`
              : "Discover Premium Real Estate Properties."}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Browse verified listings from trusted real estate partners across the country.
          </p>
        </section>

        {/* Verification Warning Prompt */}
        {!user?.isVerified && (
          <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-xl text-amber-400 border border-amber-500/30">
                ⚠️
              </span>
              <div>
                <h3 className="font-bold text-amber-200">Identity Verification Required for Sellers</h3>
                <p className="text-xs text-amber-300/80">
                  Complete Aadhaar & PAN verification to qualify as a verified seller and publish listings.
                </p>
              </div>
            </div>
            <Link
              className="rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:bg-amber-300 no-underline shadow-lg shadow-amber-400/20"
              to="/dashboard/verify"
            >
              Verify Profile Now →
            </Link>
          </section>
        )}

        {location.pathname === "/dashboard" && (
          <section className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  ESTARA MARKETPLACE
                </span>
                <h2 className="mt-1 text-2xl font-bold text-white">Featured Verified Properties</h2>
              </div>
              {!user?.role?.includes("seller") && (
                <button
                  onClick={handleBecomeSellerClick}
                  className="cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:scale-105 shadow-lg shadow-emerald-500/20"
                >
                  + Become a Seller Partner
                </button>
              )}
            </div>

            {/* Search Bar & Filter Controls */}
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl sm:grid-cols-12">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  placeholder="🔍 Search by property title, city, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              <div className="flex gap-3 sm:col-span-6">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-1/2 cursor-pointer rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-xs font-bold text-white outline-none transition focus:border-emerald-500"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      Type: {t}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-1/2 cursor-pointer rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-xs font-bold text-white outline-none transition focus:border-emerald-500"
                >
                  <option value="All">Purpose: All</option>
                  <option value="sale">Purpose: Sale</option>
                  <option value="rent">Purpose: Rent</option>
                </select>
              </div>
            </div>

            {/* Property Grid */}
            {filteredProperties.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400 backdrop-blur-xl">
                <p className="text-lg font-bold text-white">No Matching Properties Found</p>
                <p className="mt-1 text-xs text-slate-400">Try adjusting your search terms or property type filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((property) => (
                  <article
                    key={property._id}
                    onClick={() => setSelectedProperty(property)}
                    className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl transition hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl backdrop-blur-xl"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-slate-950">
                        <img
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          src={property.images?.[0]?.url || ""}
                          alt={property.title}
                        />
                        <div className="absolute left-3 top-3 flex gap-2">
                          <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase text-slate-950 shadow-md">
                            {property.propertyType}
                          </span>
                          <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase text-slate-950 shadow-md">
                            For {property.purpose}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="mb-1 text-lg font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition">
                          {property.title}
                        </h3>
                        <p className="m-0 text-xs text-slate-400">
                          📍 {property.address?.city}, {property.address?.state}
                        </p>

                        <p className="my-3 text-2xl font-black text-emerald-400">
                          ₹{Number(property.price).toLocaleString("en-IN")}
                        </p>

                        <div className="flex justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3 text-xs text-slate-300">
                          <span>{property.areaSqFt} sq ft</span>
                          <span>{property.bedrooms} Beds</span>
                          <span>{property.bathrooms} Baths</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/40 px-5 py-3.5 text-xs text-slate-400">
                      <span>Listed by <strong className="text-slate-200">{property.seller?.clientName || "Estara Partner"}</strong></span>
                      <span className="font-bold text-emerald-400 group-hover:underline">View Specs →</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <Outlet />
      </main>

      {/* Consent Modal for Becoming a Seller */}
      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onSuccess={handleConsentSuccess}
      />

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
};

export default Dashboard;

