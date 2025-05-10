import React, { useState, useEffect } from "react";
import StHomeCard from "../../../Components/Cards/StHomeCard";
import Image from "../../../assets/Studeh.png";
import { Link } from "react-router-dom";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";

const SchoolsDashboard = () => {
  const [unpaidAccounts, setUnpaidAccounts] = useState([]);
  const [totalAccounts, setTotalAccounts] = useState([]);
  const [expiredAccounts, setExpiredAccounts] = useState([]);
  const [waitingAccounts, setWaitingAccounts] = useState([]);
  const [userData, setUserData] = useState(null); // Store user data

  useEffect(() => {
    // Load user data from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    }

    // Fetch account data once the component is mounted
    const token = localStorage.getItem("token");

    const fetchAllAccounts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [unpaidRes, totalRes, expiredRes, waitingRes] = await Promise.all(
          [
            axios.get(
              "https://congozi-backend.onrender.com/api/v1/unpaidaccounts",
              config
            ),
            axios.get(
              "https://congozi-backend.onrender.com/api/v1/totaluseraccounts",
              config
            ),
            axios.get(
              "https://congozi-backend.onrender.com/api/v1/expiredaccounts",
              config
            ),
            axios.get(
              "https://congozi-backend.onrender.com/api/v1/waittingaccounts",
              config
            ),
          ]
        );

        setUnpaidAccounts(unpaidRes.data?.data || []);
        setTotalAccounts(totalRes.data?.data || []);
        setExpiredAccounts(expiredRes.data?.data || []);
        setWaitingAccounts(waitingRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchAllAccounts();
  }, []);

  return (
    <div className="flex flex-col justify-center items-start md:px-5 gap-2 bg-white md:p-2">
      <WelcomeDear userData={userData} />

      {/* Cards Section */}
      <div className="grid md:grid-cols-3 grid-cols-1 w-full md:px-0 px-12 gap-12 md:pt-2 py-5 md:gap-12">
        <StHomeCard
          bgColor="bg-blue-900"
          title="Total Accounts"
          count={totalAccounts.length}
        />
        <StHomeCard
          bgColor="bg-[#F08080]"
          title="Expired Accounts"
          count={expiredAccounts.length}
        />

        <Link to="/schools/unpaidaccounts" className="block w-full">
          <StHomeCard
            bgColor="bg-[#FACC2E]"
            title="Unpaid Accounts"
            count={unpaidAccounts.length}
          />
        </Link>

        <Link to="/schools/waitingaccounts" className="block w-full">
          <StHomeCard
            bgColor="bg-blue-200"
            title="Waiting Accounts"
            count={waitingAccounts.length}
          />
        </Link>
      </div>

      <img src={Image} alt="" className="w-[140px] md:ml-[400px] ml-28" />
    </div>
  );
};

export default SchoolsDashboard;
