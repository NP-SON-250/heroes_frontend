import React, { useState, useEffect } from "react";
import CurrentData from "../../../Components/Cards/AdminCards/CurrentData";
import {
  PiArrowBendDoubleUpRightLight,
  PiArrowBendDoubleUpLeftLight,
} from "react-icons/pi";
import { MdOutlineAccountBalanceWallet, MdBalance } from "react-icons/md";
import { TbUserQuestion } from "react-icons/tb";
import { FcEditImage } from "react-icons/fc";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
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

  // Users data
  const [lastWeekUsers, setLastWeekUsers] = useState(0);
  const [currentWeekUser, setCurrentWeekUser] = useState(0);
  const [userPercentageChange, setUserPercentageChange] = useState("0%");

  // Exams data
  const [lastWeekExams, setLastWeekExams] = useState(0);
  const [currentWeekExams, setCurrentWeekExams] = useState(0);
  const [examsPercentageChange, setExamsPercentageChange] = useState("0%");

  // Accounts data
  const [lastWeekAccounts, setLastWeekAccounts] = useState(0);
  const [currentWeekAccounts, setCurrentWeekAccounts] = useState(0);
  const [accountsPercentageChange, setAccountsPercentageChange] =
    useState("0%");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    }
    const token = localStorage.getItem("token");

    const fetchAllData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [
          userRes,
          examRes,
          paymentRes,
          lastWeekUsersRes,
          currentWeekUsersRes,
          lastWeekExamsRes,
          currentWeekExamsRes,
          lastWeekAccountsRes,
          currentWeekAccountsRes,
        ] = await Promise.all([
          axios.get("http://localhost:4700/api/v1/users", config),
          axios.get("http://localhost:4700/api/v1/exams", config),
          axios.get("http://localhost:4700/api/v1/accounts", config),
          axios.get("http://localhost:4700/api/v1/users/last-week", config),
          axios.get("http://localhost:4700/api/v1/users/current-week", config),
          axios.get("http://localhost:4700/api/v1/exams/last-week", config),
          axios.get("http://localhost:4700/api/v1/exams/current-week", config),
          axios.get("http://localhost:4700/api/v1/accounts/last-week", config),
          axios.get(
            "http://localhost:4700/api/v1/accounts/current-week",
            config
          ),
        ]);

        setTotalExams(examRes.data?.data || []);
        setTotalUsers(userRes.data?.data || []);
        setTotalPayments(paymentRes.data?.data || []);

        // Users calculations
        const lastWeekUsersCount = lastWeekUsersRes.data?.count || 0;
        const currentWeekUsersCount = currentWeekUsersRes.data?.count || 0;
        setLastWeekUsers(lastWeekUsersCount);
        setCurrentWeekUser(currentWeekUsersCount);
        calculatePercentageChange(
          currentWeekUsersCount,
          lastWeekUsersCount,
          setUserPercentageChange
        );

        // Exams calculations
        const lastWeekExamsCount = lastWeekExamsRes.data?.count || 0;
        const currentWeekExamsCount = currentWeekExamsRes.data?.count || 0;
        setLastWeekExams(lastWeekExamsCount);
        setCurrentWeekExams(currentWeekExamsCount);
        calculatePercentageChange(
          currentWeekExamsCount,
          lastWeekExamsCount,
          setExamsPercentageChange
        );

        // Accounts calculations
        const lastWeekAccountsCount = lastWeekAccountsRes.data?.count || 0;
        const currentWeekAccountsCount =
          currentWeekAccountsRes.data?.count || 0;
        setLastWeekAccounts(lastWeekAccountsCount);
        setCurrentWeekAccounts(currentWeekAccountsCount);
        calculatePercentageChange(
          currentWeekAccountsCount,
          lastWeekAccountsCount,
          setAccountsPercentageChange
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const calculatePercentageChange = (current, last, setter) => {
      if (current === last) {
        setter("0%");
      } else {
        const change = current - last;
        setter(`${Math.abs(change).toFixed(0)}%`);
      }
    };

    fetchAllData();
  }, []);

  // Helper function to determine trend display
  const getTrendData = (current, last) => {
    const icon =
      current > last ? (
        <FaArrowUpShortWide size={24} />
      ) : current === last ? (
        <MdBalance size={24} />
      ) : (
        <FaArrowDownShortWide size={24} />
      );

    const color =
      current > last
        ? "text-green-500"
        : current === last
        ? "text-yellow-500"
        : "text-red-500";

    const text =
      current > last
        ? "Up from last week"
        : current === last
        ? "Same as last week"
        : "Down from last week";

    return { icon, color, text };
  };

  // Get trend data for each card
  const usersTrend = getTrendData(currentWeekUser, lastWeekUsers);
  const examsTrend = getTrendData(currentWeekExams, lastWeekExams);
  const accountsTrend = getTrendData(currentWeekAccounts, lastWeekAccounts);

  return (
    <>
      {activeSection === "dashboard" && (
        <>
          <div className="md:py-2 py-6 w-full gap-6 justify-center items-center flex md:flex-row flex-col">
            {/* Users Card */}
            <div className="w-full md:px-4 px-4 cursor-pointer">
              <CurrentData
                title={"Total Users"}
                value={totalUsers.length}
                icon={<TbUserQuestion size={26} />}
                indicator={usersTrend.icon}
                percentage={userPercentageChange}
                textColor={usersTrend.color}
                time={usersTrend.text}
                onClick={() => handleCardClick("users")}
              />
            </div>

            {/* Exams Card */}
            <div className="w-full md:px-0 px-4 cursor-pointer">
              <CurrentData
                title={"Total Exams"}
                value={totalExams.length}
                icon={<FcEditImage size={26} />}
                indicator={examsTrend.icon}
                percentage={examsPercentageChange}
                textColor={examsTrend.color}
                time={examsTrend.text}
                onClick={() => handleCardClick("Exams")}
              />
            </div>

            {/* Accounts Card */}
            <div className="w-full md:px-0 px-4 cursor-pointer">
              <CurrentData
                title={"Total accounts"}
                value={TotalPayments.length}
                icon={<MdOutlineAccountBalanceWallet size={26} />}
                indicator={accountsTrend.icon}
                percentage={accountsPercentageChange}
                textColor={accountsTrend.color}
                time={accountsTrend.text}
                onClick={() => handleCardClick("Payments")}
              />
            </div>
          </div>
        </>
      )}
      {activeSection === "users" && (
        <div className="p-4 w-full">
          <Users />
        </div>
      )}
      {activeSection === "Exams" && (
        <div className="p-4 w-full">
          <Exams />
        </div>
      )}
      {activeSection === "Payments" && (
        <div className="p-4 w-full">
          <Payments />
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
