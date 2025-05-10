import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    phone: "",
    email: "",
    idCard: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
  });

  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fName: user.fName || "",
        lName: user.lName || "",
        phone: user.phone || "",
        email: user.email || "",
        idCard: user.idCard || "",
        address: user.address || "",
      });
      setPreview(user.profile || null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (showPasswordForm) {
      setPasswordData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return toast.error("User not logged in");

    try {
      const form = new FormData();

      if (showPasswordForm) {
        if (!passwordData.password) {
          return toast.error("Please fill in password field");
        }

        form.append("password", passwordData.password);
      } else {
        for (let key in formData) {
          if (formData[key]) {
            form.append(key, formData[key]);
          }
        }
        if (profile) {
          form.append("profile", profile);
        }
      }

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://heroes-backend-wapq.onrender.com/api/v1/users/${user._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.data;
      if (!showPasswordForm) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setMessage(
        showPasswordForm
          ? "Password updated successfully"
          : "Profile updated successfully"
      );
      setMessageType("success");

      setTimeout(() => {
        if (!showPasswordForm) {
          window.location.reload();
        } else {
          setShowPasswordForm(false);
          setPasswordData({ password: "" });
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message || "Failed to update information"
      );
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg md:p-1 p-6 w-full max-w-xl text-center">
        {/* Message */}
        {message && (
          <div
            className={`text-sm mb-3 px-2 py-1 rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <h2 className="md:text-xs text-md font-bold text-blue-900 mb-1">
          {showPasswordForm ? "Change Password" : "Your Profile"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 justify-center items-center"
        >
          {!showPasswordForm ? (
            <>
              {/* Profile Image */}
              <div className="relative w-24 h-24 mx-auto mb-1">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full border border-gray-300"
                  />
                )}
                <label className="absolute bottom-0 right-0 bg-white p-[6px] rounded-full shadow cursor-pointer">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Form Fields */}
              <input
                type="text"
                name="fName"
                value={formData.fName}
                onChange={handleChange}
                placeholder="First Name"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="lName"
                value={formData.lName}
                onChange={handleChange}
                placeholder="Last Name"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                placeholder="ID Card"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
            </>
          ) : (
            <>
              <input
                type="password"
                name="password"
                value={passwordData.password}
                onChange={handleChange}
                placeholder="New Password"
                className="md:w-1/2 w-full px-4 md:text-xs text-md py-1 border rounded"
              />
            </>
          )}

          <div className="pt-4 flex md:text-xs text-md flex-row justify-center gap-3 md:gap-10 items-center">
            <button
              type="submit"
              className="bg-blue-900 text-white px-6 py-1 rounded hover:bg-blue-800 mb-3"
            >
              {showPasswordForm ? "Update Password" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordForm((prev) => !prev)}
              className="text-blue-600 hover:text-yellow-600"
            >
              {showPasswordForm ? "Back to Profile" : "Change Password?"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminProfile;
