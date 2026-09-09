import { useState } from "react";

const ListingDetailModal = ({ property, onClose, onApprove, onReject, onDelete, actionLoading }) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!property) return null;

  const images = property.images || [];
  const primaryImg = images[selectedImgIndex]?.url || images[0]?.url || "";
  const seller = property.seller || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-slate-800 text-sm text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          ✕
        </button>

        {/* Gallery */}
        <div className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
            <img
              src={primaryImg}
              alt={property.title}
              className="h-72 w-full object-cover sm:h-80"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.public_id || idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                    selectedImgIndex === idx ? "border-teal-400" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listing Title & Price */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-black uppercase text-teal-300">
                {property.propertyType}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold uppercase text-slate-300">
                For {property.purpose}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                  property.isApproved ? "bg-emerald-500 text-slate-950" : "bg-amber-400 text-slate-950 animate-pulse"
                }`}
              >
                {property.isApproved ? "🟢 Approved" : "🟡 Pending Admin Review"}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">{property.title}</h2>
            <p className="mt-1 text-xs text-slate-400">
              📍 {property.address?.line1}, {property.address?.city}, {property.address?.state} - {property.address?.pincode}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Listed Price</span>
            <p className="text-2xl font-black text-teal-400 sm:text-3xl">
              ₹{Number(property.price).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center text-xs sm:grid-cols-4">
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Area</span>
            <span className="text-sm font-black text-white">{property.areaSqFt} sq ft</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Bedrooms</span>
            <span className="text-sm font-black text-white">{property.bedrooms} Beds</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Bathrooms</span>
            <span className="text-sm font-black text-white">{property.bathrooms} Baths</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-500">Furnishing</span>
            <span className="text-sm font-black text-white">{property.furnishing || "N/A"}</span>
          </div>
        </div>

        {/* Description & Amenities */}
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-teal-400">Full Description</h3>
            <p className="whitespace-pre-line text-xs leading-relaxed text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              {property.description}
            </p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-teal-400">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-bold text-teal-300"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comprehensive Seller Details Section */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-teal-400">
              Full Seller Profile & Verification Credentials
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                seller.isVerified ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {seller.isVerified ? "✓ Verified Seller" : "Unverified"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {seller.profilePicture?.url ? (
              <img
                src={seller.profilePicture.url}
                alt={seller.clientName}
                className="h-14 w-14 rounded-full border-2 border-teal-400 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 font-bold text-white border border-white/10">
                {seller.clientName?.charAt(0).toUpperCase() || "S"}
              </div>
            )}
            <div>
              <h4 className="text-base font-bold text-white">{seller.clientName || "Seller Partner"}</h4>
              <p className="text-xs text-slate-400">{seller.email || "No email"}</p>
            </div>
          </div>

          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-slate-900 p-3.5">
              <span className="block text-[10px] font-bold text-slate-500">Aadhaar Identification</span>
              <span className="font-mono font-bold text-white">
                {seller.verificationDetails?.aadhaarNumber || "Not Provided"}
              </span>
            </div>
            <div className="rounded-xl border border-white/5 bg-slate-900 p-3.5">
              <span className="block text-[10px] font-bold text-slate-500">PAN Card Number</span>
              <span className="font-mono font-bold text-white">
                {seller.verificationDetails?.panNumber || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => onDelete(property._id, property.title)}
            disabled={actionLoading === property._id}
            className="cursor-pointer rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            Delete Listing Permanently
          </button>

          {property.isApproved ? (
            <button
              type="button"
              onClick={() => onReject(property._id)}
              disabled={actionLoading === property._id}
              className="cursor-pointer rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400 hover:text-slate-950"
            >
              Unpublish / Reject
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApprove(property._id)}
              disabled={actionLoading === property._id}
              className="cursor-pointer rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-105"
            >
              {actionLoading === property._id ? "Approving..." : "✓ Approve & Publish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailModal;

