const CustomerDetailModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-slate-800 text-sm text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          ✕
        </button>

        {/* Header Profile */}
        <div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-6">
          {customer.profilePicture?.url ? (
            <img
              src={customer.profilePicture.url}
              alt={customer.clientName}
              className="h-16 w-16 rounded-full border-2 border-teal-400 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white border border-white/10">
              {customer.clientName?.charAt(0).toUpperCase() || "C"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">{customer.clientName}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                  customer.isVerified
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {customer.isVerified ? "✓ Verified User" : "Unverified"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">✉ {customer.email}</p>
            <div className="mt-2 flex gap-2">
              {(customer.role || ["buyer"]).map((r) => (
                <span key={r} className="rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-teal-300">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Comprehensive Details Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-teal-400">
            Customer Account & Identity Metadata
          </h3>

          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <span className="block text-[10px] font-bold text-slate-500">Customer ID</span>
              <span className="font-mono text-xs font-bold text-white">{customer._id}</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <span className="block text-[10px] font-bold text-slate-500">Account Registration Date</span>
              <span className="font-bold text-white">
                {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "N/A"}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <span className="block text-[10px] font-bold text-slate-500">Aadhaar Identification</span>
              <span className="font-mono font-bold text-white">
                {customer.verificationDetails?.aadhaarNumber || "Not Verified"}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <span className="block text-[10px] font-bold text-slate-500">PAN Card Number</span>
              <span className="font-mono font-bold text-white">
                {customer.verificationDetails?.panNumber || "Not Verified"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-xs text-slate-300">
            <span className="block text-[10px] font-black uppercase text-teal-400">Verification Status Note</span>
            <p className="mt-1 leading-relaxed text-slate-400">
              {customer.isVerified
                ? `Customer completed identity verification on ${
                    customer.verificationDetails?.verifiedAt
                      ? new Date(customer.verificationDetails.verifiedAt).toLocaleDateString()
                      : "record"
                  }.`
                : "Customer has not submitted Aadhaar or PAN identity verification documents yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;

