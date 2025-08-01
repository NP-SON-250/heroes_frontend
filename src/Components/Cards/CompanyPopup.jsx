import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CompanyPopup = ({ onClose }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navkwigate = useNavigate();

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast.error("Shyiramo tin cyangwa company name n'ijambo banga");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4700/api/v1/users/auth/school",
        {
          identifier,
          password,
        }
      );

      const { token, data, message } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(message || "Kwinjira byakunze");
      switch (data.role) {
        case "student":
          navkwigate("/students/home");
          window.location.reload();
          break;
        case "admin":
          navkwigate("/admins/home");
          window.location.reload();
          break;
        case "school":
          navkwigate("/schools/home");
          window.location.reload();
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
        <button
          onClick={onClose}
          className="absolute top-1 p-2 bg-yellow-600 rounded-full w-10 h-10 text-center right-2 text-red-500 text-lg hover:shadow-2xl font-bold"
        >
          ✖
        </button>
        <p className="text-center mb-2 capitalize">
          hemererwe kugura umuntu ufite <br />{" "}
          <strong className="pr-2">Ikikigo!</strong>
          cyangwa uwabisabye hamagara:
          <span className="text-orange-400 font-semibold text-lg pl-2">
            0789394424
          </span>
        </p>

        <p className="text-center mb-4 font-bold text-md">
          shyiramo ibikurikira
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Company Name or Tin Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <input
            type="password"
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
