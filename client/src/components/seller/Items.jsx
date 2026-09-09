import { useState } from "react";
import { useNavigate } from "react-router";
import { fetchWithAuth } from "../../utils/tokenStorage";
import { API_BASE_URL } from "../../config/api";

const AMENITY_OPTIONS = [
  "Swimming Pool",
  "Gymnasium",
  "24/7 Security",
  "Power Backup",
  "Elevator / Lift",
  "Clubhouse",
  "Garden / Park",
  "Intercom",
  "CCTV Surveillance",
  "Children Play Area",
];

const Items = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "Apartment",
    purpose: "sale",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    bedrooms: "2",
    bathrooms: "2",
    areaSqFt: "",
    furnishing: "Semi-furnished",
    parking: true,
    amenities: ["24/7 Security", "Power Backup"],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      const updated = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    if (imageFiles.length + selected.length > 8) {
      alert("You can upload a maximum of 8 images per property.");
      return;
    }

    const newFiles = [...imageFiles, ...selected];
    setImageFiles(newFiles);

    const newPreviews = selected.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.description || !formData.price || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode || !formData.areaSqFt) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please provide a valid 6-digit Pincode.");
      return;
    }

    if (imageFiles.length === 0) {
      setError("Please attach at least 1 image of the property.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("propertyType", formData.propertyType);
      payload.append("purpose", formData.purpose);
      payload.append("addressLine1", formData.addressLine1);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("pincode", formData.pincode);
      payload.append("bedrooms", formData.bedrooms);
      payload.append("bathrooms", formData.bathrooms);
      payload.append("areaSqFt", formData.areaSqFt);
      payload.append("furnishing", formData.furnishing);
      payload.append("parking", formData.parking ? "true" : "false");
      payload.append("amenities", formData.amenities.join(","));

      imageFiles.forEach((file) => {
        payload.append("images", file);
      });

      const response = await fetchWithAuth(`${API_BASE_URL}/user/seller/properties`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Property published successfully!");
        navigate("/seller/dashboard");
      } else {
        setError(data.message || "Failed to publish property.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while uploading property.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-white">List a New Property</h1>
        <p className="mt-1 text-sm text-slate-400">Provide detailed real estate specifications to attract verified buyers on Estara.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Property Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">1. Property Overview</h2>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Spacious 3 BHK Luxury Apartment in South Delhi"
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Property Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Detail key property features, connectivity, natural light, nearby landmarks, etc."
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="7500000"
                min="0"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Property Type *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full cursor-pointer rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
              >
                <option value="Apartment">Apartment</option>
                <option value="Independent house">Independent house</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Listing Purpose *
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full cursor-pointer rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">2. Location & Address</h2>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Address Line 1 / Street / Locality *
            </label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              placeholder="Sector 62, Near Metro Station"
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Noida"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Uttar Pradesh"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Pincode (6 digits) *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength={6}
                placeholder="201301"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">3. Property Specifications</h2>

          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Area (Sq. Ft.) *
              </label>
              <input
                type="number"
                name="areaSqFt"
                value={formData.areaSqFt}
                onChange={handleInputChange}
                placeholder="1450"
                min="1"
                required
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Furnishing
              </label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleInputChange}
                className="w-full cursor-pointer rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Furnished">Furnished</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="parking-check"
              type="checkbox"
              name="parking"
              checked={formData.parking}
              onChange={handleInputChange}
              className="h-5 w-5 cursor-pointer rounded border-slate-700 bg-slate-950 accent-emerald-500"
            />
            <label htmlFor="parking-check" className="cursor-pointer text-sm font-semibold text-slate-200">
              Includes Covered Parking / Dedicated Garage Space
            </label>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">4. Amenities & Features</h2>
          <div className="flex flex-wrap gap-2.5">
            {AMENITY_OPTIONS.map((item) => {
              const selected = formData.amenities.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleAmenity(item)}
                  className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition ${
                    selected
                      ? "border border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/10"
                      : "border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cloudinary Multi-Image Upload */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">5. Property Images (Cloudinary Multi-Upload) *</h2>
          <p className="text-xs text-slate-400">
            Upload up to 8 high quality images (JPG, PNG, WebP). The first image will be set as primary cover photo.
          </p>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-950/60 p-8 text-center transition hover:border-emerald-500 hover:bg-slate-950">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl text-emerald-400 border border-emerald-500/30">
              📷
            </span>
            <span className="mt-3 text-sm font-bold text-white">Click to Select Property Photos</span>
            <span className="mt-1 text-xs text-slate-400">Maximum 8 photos allowed (up to 5MB each)</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative h-28 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                  <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-md">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-950/80 text-xs text-white hover:bg-red-500 border border-white/10"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full cursor-pointer rounded-2xl py-4 text-base font-black text-slate-950 shadow-xl transition hover:scale-[1.01] active:scale-[0.99] ${
              submitting ? "bg-slate-800 text-slate-400" : "bg-linear-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20"
            }`}
          >
            {submitting ? "Uploading Images & Publishing Property..." : "Publish Property Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Items;

