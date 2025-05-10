import React, { useState, useEffect } from "react";
import CurrentData from "../../../Components/Cards/AdminCards/CurrentData";
import {
  PiArrowBendDoubleUpRightLight,
  PiArrowBendDoubleUpLeftLight,
} from "react-icons/pi";
import { TbUserQuestion } from "react-icons/tb";
import { FcEditImage, FcSalesPerformance } from "react-icons/fc";
import axios from "axios";

import Users from "./Other/Users/Users";
import Payments from "./Other/Payments/Payments";
import Exams from "./Other/Exams/Exams";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleCardClick = (section) => {
    setActiveSection(section);
  };

  const [totalExams, setTotalExams] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [TotalPayments, setTotalPayments] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Load user data from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser); // Set the user data to state
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    }

    // Fetch data once the component is mounted
    const token = localStorage.getItem("token");

    const fetchAllData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [userRes, examRes, paymentRes] = await Promise.all([
          axios.get(
            "https://congozi-backend.onrender.com/api/v1/users",
            config
          ),
          axios.get(
            "https://congozi-backend.onrender.com/api/v1/exams",
            config
          ),
          axios.get(
            "https://congozi-backend.onrender.com/api/v1/purchases",
            config
          ),
        ]);

        setTotalExams(examRes.data?.data || []);
        setTotalUsers(userRes.data?.data || []);
        setTotalPayments(paymentRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    fetchAllData();
  }, []);
  return (
    <>
      {activeSection === "dashboard" && (
        <>
          {/* Summary Cards */}
          <div className="md:py-2 py-6 w-full gap-6 justify-center items-center flex md:flex-row flex-col">
            <div className="w-full md:px-4 px-4 cursor-pointer">
              <CurrentData
                title={"Total Users"}
                value={totalUsers.length}
                icon={<TbUserQuestion size={26} />}
                indicator={<PiArrowBendDoubleUpRightLight size={24} />}
                percentage={"80.03%"}
                textColor={"text-green-500"}
                time={"Up From Last Week"}
                onClick={() => handleCardClick("users")}
              />
            </div>
            <div className="w-full md:px-0 px-4 cursor-pointer">
              <CurrentData
                title={"Total Exams"}
                value={totalExams.length}
                icon={<FcEditImage size={26} />}
                indicator={<PiArrowBendDoubleUpLeftLight size={24} />}
                percentage={"8.01%"}
                textColor={"text-red-500"}
                time={"Down From Last Week"}
                onClick={() => handleCardClick("Exams")}
              />
            </div>
            <div className="w-full md:px-0 px-4 cursor-pointer">
              <CurrentData
                title={"Total Payments"}
                value={TotalPayments.length}
                icon={<FcSalesPerformance size={26} />}
                indicator={<PiArrowBendDoubleUpRightLight size={24} />}
                percentage={"19%"}
                textColor={"text-green-500"}
                time={"Up From Last Week"}
                onClick={() => handleCardClick("Payments")}
              />
            </div>
          </div>

          {/* Request Table */}
          <div className="flex flex-col justify-center items-center md:py-4 pb-24 px-4 ">
            <h2 className="text-center md:text-xl text-blue-900 font-bold">
              Current Requests Made
            </h2>
          </div>
        </>
      )}

      {/* Users Section */}
      {activeSection === "users" && (
        <div className="p-4 w-full">
          <Users />
        </div>
      )}
      {/* Exam Section */}
      {activeSection === "Exams" && (
        <div className="p-4 w-full">
          <Exams />
        </div>
      )}
      {/* Payments Section */}
      {activeSection === "Payments" && (
        <div className="p-4 w-full">
          <Payments />
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
