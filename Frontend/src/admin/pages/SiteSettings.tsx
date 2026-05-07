import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Upload, Trash2, ImageIcon } from "lucide-react";
// @ts-ignore
import api from "../../config/api";

const SiteSettings = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const res = await api.get("/settings/site_logo");
      setLogoUrl(res.data.data || null);
    } catch {
      setLogoUrl(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = uploadRes.data.data.url;

      // Save URL to site settings
      await api.put("/settings/site_logo", { value: url });
      setLogoUrl(url);
      toast.success("Logo updated successfully!");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await api.put("/settings/site_logo", { value: null });
      setLogoUrl(null);
      toast.success("Logo removed. Default logo will be shown.");
    } catch {
      toast.error("Failed to remove logo");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Site Settings</h1>
        <p className="text-gray-500 text-xs">Manage your website logo and branding</p>
      </div>

      {/* Logo Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Website Logo</h2>

        {/* Current Logo Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-32 h-16 flex items-center justify-center bg-white rounded-md border border-gray-200 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Site Logo" className="h-full w-full object-contain p-1" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <ImageIcon size={24} className="text-gray-300" />
                <span className="text-[10px] text-gray-400">Default logo</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {logoUrl ? "Custom logo active" : "Using default logo"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {logoUrl ? "Uploaded to Cloudinary" : "/techfox_logo_transparent.png"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#FA8128] hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Upload size={15} />
            {uploading ? "Uploading..." : logoUrl ? "Change Logo" : "Upload Logo"}
          </button>

          {logoUrl && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Trash2 size={15} />
              {removing ? "Removing..." : "Remove Logo"}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Supported formats: PNG, JPG, SVG, WebP. Max size: 5MB. Recommended: transparent background PNG.
        </p>
      </div>
    </div>
  );
};

export default SiteSettings;
