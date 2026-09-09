import { useState } from "react";
import { fetchWithAuth } from "../utils/tokenStorage";
import { API_BASE_URL } from "../config/api";

const ConsentModal = ({ isOpen, onClose, onSuccess }) => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConsent = async () => {
    if (!agreed) {
      setError("Please check the box to confirm your agreement before proceeding.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/user/seller/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentAgreed: true }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onSuccess(data);
          return;
        }
      }

      let errorMsg = "Failed to accept seller agreement.";
      try {
        const data = await response.json();
        if (data.message) errorMsg = data.message;
      } catch (e) {
        errorMsg = "Server endpoint error. Please ensure the backend server has reloaded latest changes.";
      }
      setError(errorMsg);
    } catch (err) {
      console.error(err);
      setError("Network error occurred while submitting consent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#1e394f] bg-[#0d1d2b] p-6 shadow-2xl sm:p-8 text-[#e5f0ee]">
        <div className="mb-4 flex items-center justify-between border-b border-[#1c3547] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00c9a7]/15 text-[#00c9a7] text-xl">
              🏛️
            </span>
            <h2 className="text-xl font-bold text-white">Estara Seller Partner Agreement</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#152c3e] text-sm text-[#9cb6c9] transition hover:bg-[#1e394f] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto rounded-2xl border border-[#1c3547] bg-[#07111b] p-4 text-xs leading-relaxed text-[#9cb6c9]">
          <p className="mb-3 font-bold text-[#00c9a7]">
            Please review the seller responsibilities & real estate guidelines:
          </p>
          <ul className="list-disc space-y-2.5 pl-4">
            <li>You affirm that you have lawful authority to list and sell/rent the properties submitted.</li>
            <li>All property details (price, dimensions, location, amenities, and photos) must be authentic and accurate.</li>
            <li>Misleading descriptions, duplicate listings, or fraudulent property listings are strictly prohibited.</li>
            <li>You agree to allow verified Estara buyers to view your contact information for real estate inquiries.</li>
            <li>Estara reserves the right to unpublish listings that violate real estate compliance or user safety guidelines.</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/40 p-3 text-xs font-semibold text-red-300">
            ⚠️ {error}
          </div>
        )}

        <div className="mt-5 flex items-start gap-3">
          <input
            id="seller-consent-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError("");
            }}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-[#22455e] bg-[#091724] accent-[#00c9a7]"
          />
          <label htmlFor="seller-consent-checkbox" className="cursor-pointer text-xs font-semibold text-[#c8d9e6]">
            Yes, I agree to the Estara Seller Terms, Conditions & Property Listing Guidelines.
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-xl border border-[#22455e] px-4 py-2.5 text-xs font-bold text-[#9cb6c9] transition hover:bg-[#152e42] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConsent}
            disabled={loading || !agreed}
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition shadow-lg ${
              agreed && !loading
                ? "bg-[#00c9a7] text-black hover:bg-[#12dbb8] shadow-[#00c9a7]/20"
                : "cursor-not-allowed bg-[#152b3b] text-[#5b7a91]"
            }`}
          >
            {loading ? "Activating..." : "Yes, I Agree & Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
