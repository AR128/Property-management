const SellerDetailModal = ({ seller, onClose }) => {
  if (!seller) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-slate-800 text-sm text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          ✕
        </button>

        {/* Header Profile */}
        <div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-6">
          {seller.profilePicture?.url ? (
            <img
              src={seller.profilePicture.url}
              alt={seller.clientName}
              className="h-16 w-16 rounded-full border-2 border-teal-400 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white border border-white/10">
              {seller.clientName?.charAt(0).toUpperCase() || "S"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{seller.clientName}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                  seller.isVerified
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {seller.isVerified ? "✓ Verified Seller" : "Unverified"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">✉ {seller.email}</p>
            <div className="mt-2 flex gap-2">
              {(seller.role || ["seller"]).map((r) => (
                <span key={r} className="rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-teal-300">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Identity Verification Info */}
        <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-teal-400">
            Identity Verification Details (Aadhaar & PAN)
          </h3>

          <div className="grid gap-4 text-xs sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-slate-900 p-4">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Aadhaar Number</span>
              <span className="font-mono text-sm font-bold text-white">
                {seller.verificationDetails?.aadhaarNumber || "Not Provided"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900 p-4">
              <span className="block text-[10px] font-bold uppercase text-slate-500">PAN Card Number</span>
              <span className="font-mono text-sm font-bold text-white">
                {seller.verificationDetails?.panNumber || "Not Provided"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900 p-4">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Verified Timestamp</span>
              <span className="font-bold text-white">
                {seller.verificationDetails?.verifiedAt
                  ? new Date(seller.verificationDetails.verifiedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-slate-900 p-4">
              <span className="block text-[10px] font-bold uppercase text-slate-500">Account Registration Date</span>
              <span className="font-bold text-white">
                {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Properties Listed by this Seller */}
        <div>
          <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-white">
            Properties Listed by this Seller ({seller.properties?.length || 0})
          </h3>

          {!seller.properties || seller.properties.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center text-xs text-slate-400">
              No properties listed yet by this seller.
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {seller.properties.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]?.url || ""}
                      alt={p.title}
                      className="h-10 w-12 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{p.title}</h4>
                      <span className="text-slate-400">
                        📍 {p.address?.city}, {p.address?.state} · ₹{Number(p.price).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      p.isApproved ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {p.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDetailModal;

