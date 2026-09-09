import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchWithAuth } from "../../utils/tokenStorage";
import { API_BASE_URL } from "../../config/api";

const SellerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadSellerProperties = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/user/seller/properties`, {
          method: "GET",
        });
        const data = await response.json();
        if (!isCancelled) {
          if (response.ok && data.success) {
            setProperties(data.properties || []);
          } else {
            setError(data.message || "Unable to fetch your property listings.");
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          setError("Network error while fetching property listings.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadSellerProperties();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/seller/properties/${id}/status`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: data.status } : p))
        );
      } else {
        alert(data.message || "Failed to update property status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/seller/properties/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== id));
        alert("Property deleted successfully.");
      } else {
        alert(data.message || "Failed to delete property.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting property.");
    }
  };

  const activeCount = properties.filter((p) => p.status === "active" && p.isApproved).length;
  const pendingCount = properties.filter((p) => !p.isApproved).length;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings Submitted</span>
          <p className="mt-2 text-3xl font-black text-white">{properties.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Pending Admin Approval</span>
          <p className="mt-2 text-3xl font-black text-amber-300">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-xl backdrop-blur-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Approved & Live</span>
          <p className="mt-2 text-3xl font-black text-emerald-400">{activeCount}</p>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Your Property Listings</h1>
          <p className="mt-1 text-sm text-slate-400">Manage real estate listings submitted for Admin moderation and buyer marketplace.</p>
        </div>
        <Link
          to="/seller/items"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98] no-underline"
        >
          <span className="text-lg">+</span> List New Property
        </Link>
      </div>

      {/* Property List */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center text-emerald-400 font-bold animate-pulse">
          Fetching your property portfolio...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300 font-semibold">
          {error}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-3xl text-emerald-400">
            🏠
          </div>
          <h3 className="text-xl font-bold text-white">No Properties Listed Yet</h3>
          <p className="mx-auto mb-6 mt-2 max-w-md text-sm text-slate-400">
            Start listing residential, commercial, or plot real estate items to connect with verified buyers.
          </p>
          <Link
            to="/seller/items"
            className="inline-block rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-105 no-underline"
          >
            Create First Property Listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl transition hover:border-emerald-500/40 hover:shadow-2xl backdrop-blur-xl"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-950">
                  <img
                    src={property.images?.[0]?.url || ""}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                        property.isApproved
                          ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                          : "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 animate-pulse"
                      }`}
                    >
                      {property.isApproved ? "🟢 Approved & Live" : "🟡 Pending Admin Review"}
                    </span>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    {property.images?.length || 0} Photos
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-400">
                    <span>{property.propertyType}</span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-slate-300">
                      For {property.purpose}
                    </span>
                  </div>

                  <h3 className="mb-1 mt-2 text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                  <p className="text-xs text-slate-400">
                    📍 {property.address?.city}, {property.address?.state}
                  </p>

                  <p className="my-3 text-2xl font-black text-emerald-400">
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </p>

                  <div className="flex justify-between rounded-xl border border-white/5 bg-slate-950/60 p-3 text-xs text-slate-300">
                    <span>{property.areaSqFt} sq ft</span>
                    <span>{property.bedrooms} Bed</span>
                    <span>{property.bathrooms} Bath</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 bg-slate-950/50 p-4">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(property._id)}
                  className="flex-1 cursor-pointer rounded-xl border border-white/10 bg-slate-800 py-2.5 text-xs font-bold text-slate-200 transition hover:border-emerald-500/40 hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  Mark as {property.status === "active" ? "Sold" : "Active"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(property._id, property.title)}
                  className="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

