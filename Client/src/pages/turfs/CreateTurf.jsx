import React, { useState } from "react";
import {
  Upload,
  MapPin,
  DollarSign,
  User,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateTurf = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    ownerId: "",
    ownerName: "",
    rent: "",
    image: "", // Changed to string for URL
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const payload = {
        ...formData,
        rent: parseFloat(formData.rent),
      };

      const res = await fetch("http://localhost:3000/turfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/turfs");
      } else {
        const errorData = await res.json();
        alert("Failed to create turf: " + errorData.error);
      }
    } catch (error) {
      console.error("Error creating turf:", error);
      alert("Error creating turf");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans flex justify-center">
      <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
          Register New <span className="text-lime-400">Arena</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Arena Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-lime-400 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-lime-400 outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Rent (BDT)
              </label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-lime-400 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-lime-400 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-lime-400 outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Owner ID
              </label>
              <input
                type="text"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-lime-400 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Cover Image URL
            </label>
            <div className="relative group">
              <ImageIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-lime-400 transition-colors"
                size={18}
              />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 focus:border-lime-400 outline-none transition-colors"
                required
              />
            </div>
            {formData.image && (
              <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-lime-400 text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-lime-300 transition-colors disabled:opacity-50"
          >
            {uploading ? "Deploying..." : "Initialize Arena"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTurf;
