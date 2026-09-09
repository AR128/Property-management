import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchWithAuth } from "../utils/tokenStorage";
import { API_BASE_URL } from "../config/api";

const VerificationForm = () => {
  const navigate = useNavigate();
  const [aadhaarError, setAadhaarError] = useState("");
  const [panError, setPanError] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    aadhaarNumber: "",
    panNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "profilePicture") {
      const file = e.target.files?.[0] || null;
      setProfilePicture(file);
      setProfilePreview(file ? URL.createObjectURL(file) : "");
      return;
    }

    if (name === "aadhaarNumber") {
      const aadhaar = value.replace(/\D/g, "").slice(0, 12);
      setFormData((prev) => ({ ...prev, aadhaarNumber: aadhaar }));
      if (aadhaar.length === 12 && !validateAadhaar(aadhaar)) {
        setAadhaarError("Enter a valid 12-digit Aadhaar number starting with 2-9.");
      } else {
        setAadhaarError("");
      }
      return;
    }

    if (name === "panNumber") {
      const pan = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, panNumber: pan }));
      if (pan.length === 10 && !validatePan(pan)) {
        setPanError("Enter a valid PAN format (e.g. ABCDE1234F).");
      } else {
        setPanError("");
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAadhaar(formData.aadhaarNumber)) {
      setAadhaarError("Enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (!validatePan(formData.panNumber)) {
      setPanError("Enter a valid 10-character PAN number.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("clientName", formData.clientName);
      payload.append("aadhaarNumber", formData.aadhaarNumber);
      payload.append("panNumber", formData.panNumber);
      if (profilePicture) payload.append("profilePicture", profilePicture);

      const response = await fetchWithAuth(
        `${API_BASE_URL}/user/dashboard/verify`,
        {
          method: "POST",
          body: payload,
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Identity verification updated successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        alert(data.message || "Verification submission failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/user/dashboard`,
          { method: "GET" },
        );
        const data = await response.json();

        if (response.ok && data.user) {
          setFormData((prev) => ({
            ...prev,
            clientName: data.user.clientName || "",
            email: data.user.email || "",
            aadhaarNumber: data.user.verificationDetails?.aadhaarNumber || "",
            panNumber: data.user.verificationDetails?.panNumber || "",
          }));
          setProfilePreview(data.user.profilePicture?.url || "");
          setIsVerified(data.user.isVerified || false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const validateAadhaar = (value) => /^[2-9]\d{11}$/.test(value);
  const validatePan = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-[#1e394f] bg-[#112230]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10 text-[#e5f0ee]">
      <div className="mb-6 flex items-center justify-between border-b border-[#1c3547] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#00c9a7]">
            Identity & Profile Credentials
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            Account Verification
          </h1>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase shadow-md ${
            isVerified
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}
        >
          {isVerified ? "✓ Verified Partner" : "Pending Verification"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture Section */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            {profilePreview ? (
              <img
                className="h-16 w-16 rounded-full border-2 border-[#00c9a7] object-cover shadow-md"
                src={profilePreview}
                alt="Profile preview"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#173042] text-xl font-bold text-[#00c9a7]">
                👤
              </div>
            )}
            <input
              className="w-full cursor-pointer rounded-xl border border-[#22455e] bg-[#091724] px-4 py-2.5 text-xs text-[#9cb6c9] file:mr-3 file:rounded-lg file:border-0 file:bg-[#00c9a7] file:px-3 file:py-1.5 file:font-bold file:text-black hover:file:bg-[#12dbb8]"
              type="file"
              name="profilePicture"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            Full Name *
          </label>
          <input
            className="w-full rounded-xl border border-[#22455e] bg-[#091724] px-4 py-3 text-sm text-white outline-none transition focus:border-[#00c9a7] focus:ring-2 focus:ring-[#00c9a7]/20"
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            Registered Email
          </label>
          <input
            className="w-full cursor-not-allowed rounded-xl border border-[#1c3547] bg-[#0d1c28] px-4 py-3 text-sm text-[#7392a8] outline-none"
            type="email"
            name="email"
            value={formData.email}
            readOnly
          />
        </div>

        {/* Aadhaar Number */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            Aadhaar Number (12 digits) *
          </label>
          <input
            className="w-full rounded-xl border border-[#22455e] bg-[#091724] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-[#00c9a7] focus:ring-2 focus:ring-[#00c9a7]/20"
            type="text"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={12}
            placeholder="200011112222"
            required
          />
          {aadhaarError && (
            <p className="mt-1.5 text-xs font-semibold text-red-400">⚠️ {aadhaarError}</p>
          )}
        </div>

        {/* PAN Card Number */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#9cb6c9]">
            PAN Card Number (10 characters) *
          </label>
          <input
            className="w-full rounded-xl border border-[#22455e] bg-[#091724] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-[#00c9a7] focus:ring-2 focus:ring-[#00c9a7]/20"
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            maxLength={10}
            placeholder="ABCDE1234F"
            required
          />
          {panError && (
            <p className="mt-1.5 text-xs font-semibold text-red-400">⚠️ {panError}</p>
          )}
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-[#00c9a7] py-3.5 text-sm font-extrabold text-black shadow-xl shadow-[#00c9a7]/20 transition hover:-translate-y-0.5 hover:bg-[#12dbb8]"
          >
            {loading ? "Submitting Verification..." : "Save & Verify Identity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;
