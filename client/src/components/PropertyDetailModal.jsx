import { useState } from "react";

const PropertyDetailModal = ({ property, onClose }) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!property) return null;

  const images = property.images || [];
  const primaryImg = images[selectedImgIndex]?.url || images[0]?.url || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#1e394f] bg-[#0d1d2b] p-6 shadow-2xl sm:p-8 text-[#e5f0ee]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#152c3e] text-sm text-[#9cb6c9] transition hover:bg-[#1e394f] hover:text-white"
        >
          ✕
        </button>

        {/* Gallery */}
        <div className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-[#1c3547] bg-[#07111b]">
            <img
              src={primaryImg}
              alt={property.title}
              className="h-72 w-full object-cover sm:h-96"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.public_id || idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                    selectedImgIndex === idx ? "border-[#00c9a7]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#1c3547] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#00c9a7]/20 px-3 py-1 text-xs font-extrabold uppercase text-[#00c9a7]">
                {property.propertyType}
              </span>
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-extrabold uppercase text-amber-300">
                For {property.purpose}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{property.title}</h2>
            <p className="mt-1 text-xs text-[#9cb6c9]">
              📍 {property.address?.line1}, {property.address?.city}, {property.address?.state} - {property.address?.pincode}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase text-[#82a3b8]">Listing Price</span>
            <p className="text-2xl font-extrabold text-[#00c9a7] sm:text-3xl">
              ₹{Number(property.price).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-[#1c3547] bg-[#07111b] p-4 text-center text-xs sm:grid-cols-4">
          <div>
            <span className="block text-[10px] uppercase text-[#6d889c]">Built Area</span>
            <span className="text-sm font-extrabold text-white">{property.areaSqFt} sq.ft</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-[#6d889c]">Bedrooms</span>
            <span className="text-sm font-extrabold text-white">{property.bedrooms} Beds</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-[#6d889c]">Bathrooms</span>
            <span className="text-sm font-extrabold text-white">{property.bathrooms} Baths</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-[#6d889c]">Furnishing</span>
            <span className="text-sm font-extrabold text-white">{property.furnishing || "N/A"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00c9a7]">Property Overview</h3>
          <p className="whitespace-pre-line text-xs leading-relaxed text-[#c8d9e6] bg-[#07111b] p-4 rounded-2xl border border-[#1c3547]">
            {property.description}
          </p>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#00c9a7]">Features & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((item, index) => (
                <span
                  key={index}
                  className="rounded-xl border border-[#1c3547] bg-[#07111b] px-3 py-1.5 text-xs font-semibold text-[#00c9a7]"
                >
                  ✓ {item}
                </span>
              ))}
              {property.parking && (
                <span className="rounded-xl border border-[#1c3547] bg-[#07111b] px-3 py-1.5 text-xs font-semibold text-[#00c9a7]">
                  ✓ Dedicated Covered Parking
                </span>
              )}
            </div>
          </div>
        )}

        {/* Seller Profile Drawer */}
        <div className="rounded-2xl border border-[#1c3547] bg-[#07111b] p-5">
          <div className="mb-3 flex items-center justify-between border-b border-[#1c3547] pb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00c9a7]">
              Verified Property Seller
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
              ✓ Verified Credentials
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {property.seller?.profilePicture?.url ? (
                <img
                  src={property.seller.profilePicture.url}
                  alt={property.seller.clientName}
                  className="h-12 w-12 rounded-full border border-[#00c9a7] object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#152c3e] font-bold text-white">
                  {property.seller?.clientName?.charAt(0).toUpperCase() || "S"}
                </div>
              )}
              <div>
                <h4 className="font-bold text-white">{property.seller?.clientName || "Estara Partner"}</h4>
                <p className="text-xs text-[#82a3b8]">{property.seller?.email || "Direct Seller Contact"}</p>
              </div>
            </div>

            <a
              href={`mailto:${property.seller?.email}`}
              className="rounded-xl bg-[#00c9a7] px-4 py-2.5 text-xs font-extrabold text-black transition hover:bg-[#12dbb8] no-underline shadow-lg"
            >
              Contact Owner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;
