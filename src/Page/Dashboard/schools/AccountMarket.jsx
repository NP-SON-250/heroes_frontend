import React, { useState, useEffect } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import axios from "axios";
import LoadingSpinner from "../../../Components/LoadingSpinner ";

const AccountMarket = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [valid, setValid] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const [isPayingLater, setIsPayingLater] = useState(false);
  const [account, setAccount] = useState({ data: [] });
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUserName(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4700/api/v1/accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccount(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const accounts = account.data || [];

  useEffect(() => {
    const updateAccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateAccountsPerPage();
    window.addEventListener("resize", updateAccountsPerPage);
    return () => window.removeEventListener("resize", updateAccountsPerPage);
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      (valid === "" ||
        account.validIn.toLowerCase().includes(valid.toLowerCase())) &&
      (fees === "" || account.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        account.validIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.fees.toString().includes(searchTerm) ||
        account.title.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const handlePurchaseClick = (account) => {
    setSelectedAccount(account);
    setPaymentStep("confirmation");
  };

  const handlePayLaterClick = async () => {
    if (isPayingLater) return;

    setIsPayingLater(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4700/api/v1/purchases/${selectedAccount._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closePopup();
      navigate("/schools/accounts");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("You have already purchased this account.");
      } else {
        console.error("Purchase request failed:", error);
        alert("Failed to initiate purchase. Please try again.");
      }
    } finally {
      setIsPayingLater(false);
    }
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white">
      <WelcomeDear />
      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="---Shaka konte n'iminsi imara ---"
          value={valid}
          onChange={(e) => setValid(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer text-bold"
        />
        <input
          type="text"
          placeholder="---Shaka konte n'igiciro---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden md:bloc">
          <input
            type="search"
            placeholder="Shaka konte n'igiciro cg iminsi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="Shaka konte n'igiciro cg iminsi"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl w-full"
        />
      </div>

      {filteredAccounts.length === 0 ? (
        <p className="text-center py-4 text-red-500">No data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentAccounts.map((account, index) => {
            const buttonColor =
              account.validIn >= 30 ? "bg-green-500" : "bg-yellow-500";
            return (
              <AccountCard
                key={index}
                title={`Konte ${currentPage * accountsPerPage + index + 1}: ${
                  account.title
                }`}
                fees={account.fees}
                validIn={account.validIn}
                onPurchase={() => handlePurchaseClick(account)}
                icon={<BsCart />}
                button={"Kugura"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[70px] md:pb-0 pt-3 px-10 ">
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <FaArrowAltCircleLeft size={24} />
            Izibanza
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Izikukira <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}

      {selectedAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-md w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>

            {paymentStep === "confirmation" ? (
              <>
                <h2 className="text-lg text-start font-bold text-Total px-6 pt-6">
                  Mukiriya {userName?.companyName},
                </h2>
                <p className="mt-0 text-start text-Total px-6">
                  Ugiye gusaba kugura konte{" "}
                  <span className="font-bold">{selectedAccount.title}</span>{" "}
                  izarangira muminsi{" "}
                  <span className="font-bold">{selectedAccount.validIn}</span>{" "}
                  uribwishyure ayamafaranga
                  <span className="font-bold pl-1">
                    ({selectedAccount.fees} RWF.)
                  </span>{" "}
                  <span>Ufite ikibazo wahamagara iyi nemero:</span>
                  <span className="text-yellow-600 pl-2">0789394424</span>
                </p>
                <div className="flex justify-center md:p-6 p-2 md:mt-12 mt-6 mb-2 md:gap-20 gap-6">
                  <button
                    className={`bg-green-500  w-full text-white p-2 rounded ${
                      isPayingLater ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handlePayLaterClick}
                    disabled={isPayingLater}
                  >
                    {isPayingLater ? <LoadingSpinner /> : "Saba kugura"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMarket;
