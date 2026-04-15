import { useState, useEffect } from "react";
import { User, Mail,Lock, Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../../services/studentService";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    avatar: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await studentService.getProfile();
      setProfileData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone?.replace("+91", "") || "",
        avatar: response.data.avatar || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to user context data
      if (user) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone?.replace("+91", "") || "",
          avatar: user.avatar || ""
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setProfileData(prev => ({ ...prev, phone: digitsOnly }));
        if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
          setPhoneError("Phone number must be 10 digits");
        } else {
          setPhoneError("");
        }
      }
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (profileData.phone && profileData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setSaving(true);
    try {
      const updateData: { name: string; phone?: string } = {
        name: profileData.name.trim()
      };

      if (profileData.phone) {
        updateData.phone = `+91${profileData.phone}`;
      }

      const response = await studentService.updateProfile(updateData);

      // Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.name = response.data.name;
        userData.phone = response.data.phone;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await studentService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Profile Settings</h1>
        <p className="text-gray-500 text-xs">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={16} className="text-[#FA8128]" />
            Personal Information
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar Preview */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FA8128] rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                {profileData.name.charAt(0).toUpperCase() || "S"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{profileData.name || "Student"}</p>
                <p className="text-xs text-gray-500 truncate">{profileData.email}</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <div className={`flex border rounded-lg overflow-hidden ${phoneError ? 'border-red-300' : 'border-gray-200'}`}>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 bg-gray-50 border-r border-gray-200">
                  <span className="text-sm">🇮🇳</span>
                  <span className="text-sm text-gray-600">+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number"
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none min-w-0"
                />
              </div>
              {phoneError && <p className="text-red-500 text-[10px] mt-1">{phoneError}</p>}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#FA8128] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#FA8128] transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lock size={16} className="text-[#FA8128]" />
            Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FA8128]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Change Password Button */}
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Lock size={16} />
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
