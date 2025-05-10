import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CompanyPopup = ({ onClose }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast.error("Shyiramo tin cyangwa company name n'ijambo banga");
      return;
    }

    try {
      const response = await axios.post(
        "https://heroes-backend-wapq.onrender.com/api/v1/users/auth/school",
        {
          identifier,
          password,
        }
      );

      const { token, data, message } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(message || "Kwinjira byakunze");
      // Role-based redirect
      switch (data.role) {
        case "student":
          navigate("/students/home");
          break;
        case "admin":
          navigate("/admins/home");
          break;
        case "school":
          navigate("/schools/home");
          break;
        default:
          toast.error("User role not recognized.");
          break;
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Login failed. Try again.";
      toast.error(errMsg);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      <div className="bg-[#1e2a87] text-white rounded-2xl p-6 w-[90%] md:w-[500px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 p-2 bg-yellow-600 rounded-full w-10 h-10 text-center right-2 text-red-500 text-lg hover:shadow-2xl font-bold"
        >
          ✖
        </button>

        {/* Content */}
        <p className="md:text-start text-center mb-2 md:pl-24 capitalize">
          hemererwe kugura umuntu ufite <br />{" "}
          <strong className="pr-2">Ikkigo!</strong>
          cyangwa uwabisabye hamagara: <br />
          <span className="text-orange-400 font-semibold text-lg">
            +250 792 337 053
          </span>
        </p>

        <p className="text-center mb-4 font-bold text-md">
          shyiramo ibikurikira
        </p>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Company Name or Tin Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <input
            type="text"
            placeholder="Ijambo Banga Winjiriraho"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <button
            onClick={handleLogin}
            className="bg-orange-500  text-white px-2 py-1 rounded-md font-semibold hover:bg-orange-600"
          >
            Injira
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CompanyPopup;
