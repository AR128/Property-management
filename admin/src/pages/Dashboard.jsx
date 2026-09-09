import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { clearAccessToken, fetchWithAuth } from "../utils/tokenStorage";
import SellerDetailModal from "../components/SellerDetailModal";
import ListingDetailModal from "../components/ListingDetailModal";
import CustomerDetailModal from "../components/CustomerDetailModal";

const Dashboard = () => {
  const navigate = useNavigate();

  // Navigation Panel State: 'sellers' | 'listings' | 'buyers'
  const [activePanel, setActivePanel] = useState("sellers");

  // Data States
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [listingsFilter, setListingsFilter] = useState("all"); // 'all' | 'pending' | 'approved'

  // Modal Inspection States
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const loadAllAdminData = async () => {
      try {
        // Fetch Sellers List
        const sellersRes = await fetchWithAuth("http://localhost:3000/admin/sellers", { method: "GET" });
        if (sellersRes.ok && !isCancelled) {
          const data = await sellersRes.json();
          setSellers(data.sellers || []);
        }

        // Fetch Buyers List
        const buyersRes = await fetchWithAuth("http://localhost:3000/admin/buyers", { method: "GET" });
        if (buyersRes.ok && !isCancelled) {
          const data = await buyersRes.json();
          setBuyers(data.buyers || []);
        }

        // Fetch Properties List
        const propRes = await fetchWithAuth("http://localhost:3000/admin/properties", { method: "GET" });
        if (propRes.ok && !isCancelled) {
          const data = await propRes.json();
          setProperties(data.properties || []);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
          clearAccessToken();
          navigate("/admin");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadAllAdminData();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const response = await fetchWithAuth(`http://localhost:3000/admin/properties/${id}/approve`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isApproved: true, status: "active" } : p))
        );
        if (selectedListing?._id === id) {
          setSelectedListing((prev) => (prev ? { ...prev, isApproved: true, status: "active" } : null));
        }
        alert("Property approved! It is now live on the buyer dashboard.");
      } else {
        alert(data.message || "Failed to approve property.");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving property.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      const response = await fetchWithAuth(`http://localhost:3000/admin/properties/${id}/reject`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isApproved: false } : p))
        );
        if (selectedListing?._id === id) {
          setSelectedListing((prev) => (prev ? { ...prev, isApproved: false } : null));
        }
        alert("Property listing rejected / unpublished.");
      } else {
        alert(data.message || "Failed to reject property.");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting property.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteListing = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    setActionLoading(id);
    try {
      const response = await fetchWithAuth(`http://localhost:3000/admin/properties/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
        setSelectedListing(null);
        alert("Property deleted permanently.");
      } else {
        alert(data.message || "Failed to delete property.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting property.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    clearAccessToken();
    navigate("/admin");
  };

  // Filtered lists based on search
  const filteredSellers = sellers.filter(
    (s) =>
      s.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBuyers = buyers.filter(
    (b) =>
      b.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredListings = properties.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seller?.clientName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      listingsFilter === "all"
        ? true
        : listingsFilter === "pending"
        ? !p.isApproved
        : p.isApproved;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = properties.filter((p) => !p.isApproved).length;

  return (
    <div className="min-h-screen bg-[#080E17] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,245,212,0.1),rgba(255,255,255,0))] px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-teal-400">
              Estara Admin Command Center
            </span>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Executive Moderation Portal
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-slate-950"
          >
            Sign Out Admin
          </button>
        </div>

        {/* Panel Switcher Navigation Tabs */}
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              setActivePanel("sellers");
              setSearchQuery("");
            }}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-6 transition text-left backdrop-blur-xl ${
              activePanel === "sellers"
                ? "border-teal-400 bg-slate-900 shadow-2xl ring-2 ring-teal-400/20"
                : "border-white/10 bg-slate-900/60 opacity-80 hover:opacity-100 hover:border-slate-700"
            }`}
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                Panel 1
              </span>
              <h2 className="mt-1 text-xl font-bold text-white">🏪 Sellers Panel</h2>
              <p className="mt-1 text-xs text-slate-400">Inspect registered seller profiles & credentials</p>
            </div>
            <span className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-sm font-black text-teal-300">
              {sellers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePanel("listings");
              setSearchQuery("");
            }}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-6 transition text-left backdrop-blur-xl ${
              activePanel === "listings"
                ? "border-teal-400 bg-slate-900 shadow-2xl ring-2 ring-teal-400/20"
                : "border-white/10 bg-slate-900/60 opacity-80 hover:opacity-100 hover:border-slate-700"
            }`}
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Panel 2 {pendingCount > 0 && `(🟡 ${pendingCount} Pending)`}
              </span>
              <h2 className="mt-1 text-xl font-bold text-white">🏡 Property Moderation</h2>
              <p className="mt-1 text-xs text-slate-400">Review property specs & seller info for approval</p>
            </div>
            <span className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-sm font-black text-teal-300">
              {properties.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePanel("buyers");
              setSearchQuery("");
            }}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-6 transition text-left backdrop-blur-xl ${
              activePanel === "buyers"
                ? "border-teal-400 bg-slate-900 shadow-2xl ring-2 ring-teal-400/20"
                : "border-white/10 bg-slate-900/60 opacity-80 hover:opacity-100 hover:border-slate-700"
            }`}
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Panel 3
              </span>
              <h2 className="mt-1 text-xl font-bold text-white">👥 Customers / Buyers</h2>
              <p className="mt-1 text-xs text-slate-400">Inspect customer details & platform activity</p>
            </div>
            <span className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-sm font-black text-teal-300">
              {buyers.length}
            </span>
          </button>
        </div>

        {/* Search Bar & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`🔍 Search in ${
                activePanel === "sellers"
                  ? "Sellers (name or email)..."
                  : activePanel === "listings"
                  ? "Listings (title, city, seller name)..."
                  : "Customers (name or email)..."
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-400"
            />
          </div>

          {activePanel === "listings" && (
            <div className="flex rounded-xl border border-slate-700/80 bg-slate-950/80 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setListingsFilter("all")}
                className={`cursor-pointer rounded-lg px-3.5 py-2 transition ${
                  listingsFilter === "all" ? "bg-teal-400 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                All ({properties.length})
              </button>
              <button
                type="button"
                onClick={() => setListingsFilter("pending")}
                className={`cursor-pointer rounded-lg px-3.5 py-2 transition ${
                  listingsFilter === "pending" ? "bg-amber-400 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setListingsFilter("approved")}
                className={`cursor-pointer rounded-lg px-3.5 py-2 transition ${
                  listingsFilter === "approved" ? "bg-emerald-500 text-slate-950 font-black" : "text-slate-400 hover:text-white"
                }`}
              >
                Approved ({properties.length - pendingCount})
              </button>
            </div>
          )}
        </div>

        {/* Panel Content Display */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center text-teal-400 font-bold animate-pulse">
            Loading platform data from database...
          </div>
        ) : (
          <>
            {/* PANEL 1: SELLERS LIST */}
            {activePanel === "sellers" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Registered Sellers on Estara ({filteredSellers.length})</span>
                  <span>Click on any seller card to inspect full verification details</span>
                </div>

                {filteredSellers.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400 backdrop-blur-xl">
                    No sellers found.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSellers.map((seller) => (
                      <div
                        key={seller._id}
                        onClick={() => setSelectedSeller(seller)}
                        className="group flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl transition hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-2xl backdrop-blur-xl"
                      >
                        <div className="flex items-start gap-3.5">
                          {seller.profilePicture?.url ? (
                            <img
                              src={seller.profilePicture.url}
                              alt={seller.clientName}
                              className="h-12 w-12 rounded-full border border-teal-400/40 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 font-bold text-white border border-white/10">
                              {seller.clientName?.charAt(0).toUpperCase() || "S"}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white group-hover:text-teal-300 transition">
                                {seller.clientName}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-400">{seller.email}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                                  seller.isVerified
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {seller.isVerified ? "✓ Verified" : "Unverified"}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                {seller.properties?.length || 0} Listings
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-teal-400 opacity-0 transition group-hover:opacity-100">
                          View →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL 2: SELLER LISTINGS */}
            {activePanel === "listings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Property Submissions Moderation ({filteredListings.length})</span>
                  <span>Click on any property card to view complete specs & seller identity</span>
                </div>

                {filteredListings.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400 backdrop-blur-xl">
                    No properties match your filter.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredListings.map((property) => (
                      <div
                        key={property._id}
                        onClick={() => setSelectedListing(property)}
                        className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl transition hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-2xl backdrop-blur-xl"
                      >
                        <div>
                          <div className="relative h-44 w-full bg-slate-950">
                            <img
                              src={property.images?.[0]?.url || ""}
                              alt={property.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                            <div className="absolute left-3 top-3 flex gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase shadow-md ${
                                  property.isApproved
                                    ? "bg-emerald-500 text-slate-950"
                                    : "bg-amber-400 text-slate-950 animate-pulse"
                                }`}
                              >
                                {property.isApproved ? "🟢 Approved" : "🟡 Pending Review"}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-teal-400">
                              <span>{property.propertyType}</span>
                              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
                                For {property.purpose}
                              </span>
                            </div>

                            <h3 className="mb-1 mt-2 text-lg font-bold text-white line-clamp-1 group-hover:text-teal-300 transition">
                              {property.title}
                            </h3>
                            <p className="text-xs text-slate-400">
                              📍 {property.address?.city}, {property.address?.state}
                            </p>

                            <p className="my-2.5 text-2xl font-black text-teal-400">
                              ₹{Number(property.price).toLocaleString("en-IN")}
                            </p>

                            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
                              <span>Seller: <strong className="text-slate-200">{property.seller?.clientName || "Unknown"}</strong></span>
                              <span className="font-bold text-teal-400 group-hover:underline">Inspect →</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL 3: CUSTOMERS / BUYERS LIST */}
            {activePanel === "buyers" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Registered Customers / Buyers ({filteredBuyers.length})</span>
                  <span>Click on any customer card to view full account details</span>
                </div>

                {filteredBuyers.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400 backdrop-blur-xl">
                    No customers found.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBuyers.map((buyer) => (
                      <div
                        key={buyer._id}
                        onClick={() => setSelectedCustomer(buyer)}
                        className="group flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl transition hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-2xl backdrop-blur-xl"
                      >
                        <div className="flex items-start gap-3.5">
                          {buyer.profilePicture?.url ? (
                            <img
                              src={buyer.profilePicture.url}
                              alt={buyer.clientName}
                              className="h-12 w-12 rounded-full border border-teal-400/40 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 font-bold text-white border border-white/10">
                              {buyer.clientName?.charAt(0).toUpperCase() || "C"}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-white group-hover:text-teal-300 transition">
                              {buyer.clientName}
                            </h3>
                            <p className="text-xs text-slate-400">{buyer.email}</p>

                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                                  buyer.isVerified
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {buyer.isVerified ? "✓ Verified" : "Unverified"}
                              </span>
                              <span className="text-slate-500 text-[11px]">
                                Joined {buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-teal-400 opacity-0 transition group-hover:opacity-100">
                          View →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals for Deep Dive Inspection */}
      <SellerDetailModal
        seller={selectedSeller}
        onClose={() => setSelectedSeller(null)}
      />

      <ListingDetailModal
        property={selectedListing}
        onClose={() => setSelectedListing(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDeleteListing}
        actionLoading={actionLoading}
      />

      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
};

export default Dashboard;

