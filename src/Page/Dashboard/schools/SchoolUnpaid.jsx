import React, { useState, useEffect } from "react";
import AccountCard from "../../../Components/Cards/AdminCards/AccountCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";

const SchoolUnpaid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountsPerPage, setAccountsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [validIn, setvalidIn] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const [account, setAccount] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const [phoneUsed, setPhoneUsed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  // Get user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(`${user.companyName}`);
    }
  }, []);
  // Fetch unpaid accounts
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://heroes-backend-wapq.onrender.com/api/v1/purchases/pending",
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

  // Adjust items per page on screen resize
  useEffect(() => {
    const updateaccountsPerPage = () => {
      setAccountsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateaccountsPerPage();
    window.addEventListener("resize", updateaccountsPerPage);
    return () => window.removeEventListener("resize", updateaccountsPerPage);
  }, []);

  const filteredAccounts = account.data.filter(
    (item) =>
      (validIn === "" ||
        item.itemId.validIn?.toLowerCase().includes(validIn.toLowerCase())) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.validIn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.fees?.toString().includes(searchTerm) ||
        item.itemId.title?.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  const currentAccounts = filteredAccounts.slice(
    currentPage * accountsPerPage,
    (currentPage + 1) * accountsPerPage
  );

  const handlePurchaseClick = (account) => {
    setSelectedAccount(account);
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
    setPhoneUsed("");
    setOwnerName("");
  };

  const handleNotify = async () => {
    if (!phoneUsed || !ownerName) {
      setMessage({
        text: "Wongera uzuzise nimero ya telephone n'amazina y'umunyamikoro",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const purchasedDataId = selectedAccount._id;
      const paidItem = selectedAccount.itemId;
      const notificationMessage = `Dear Admin, Turakumenyesha ko ${userName} yishyuye konte yitwa ${paidItem.title} izarangira muminsi ${paidItem.validIn} amafaranga ${paidItem.fees} Rwf akoresheje telephone ${phoneUsed} ibaruye kuri ${ownerName}. Reba ko wayabonye kuri telephone nimero: 0789394424 maze umuhe uburenganzira kuri iyi purchase Id: ${purchasedDataId}. Murakoze!!!!!`;
      const noteTitle = `${userName} requests for approval`;
      const response = await axios.post(
        "https://heroes-backend-wapq.onrender.com/api/v1/notification",
        {
          message: notificationMessage,
          noteTitle: noteTitle,
          purchasedItem: purchasedDataId,
          ownerName: userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const purchaseId = selectedAccount._id;
      await axios.put(
        `https://heroes-backend-wapq.onrender.com/api/v1/purchases/${purchaseId}`,
        { status: "waitingConfirmation" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.delete(
        `https://heroes-backend-wapq.onrender.com/api/v1/unpaidaccounts/${paidItem._id}`
      );
      setMessage({
        text: response.data.message || "Kwishyura byakunze neza!",
        type: "success",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);

      closePopup();
      fetchData();
    } catch (error) {
      setMessage({
        text: "Kwishyura byanze. Wongera gerageza.",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 9000);
      console.error("Payment error:", error);
      closePopup();
      fetchData();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />

      {/* Filters */}
      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-32 gap-1 px-3 py-4">
        <input
          type="text"
          placeholder="---Shaka ukoresheje igihe konte izarangirira---"
          value={validIn}
          onChange={(e) => setvalidIn(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <input
          type="text"
          placeholder="---Shaka n'igiciro---"
          value={fees}
          onChange={(e) => setFees(e.target.value)}
          className="border-2 border-blue-500 p-2 rounded-xl cursor-pointer"
        />
        <div className="w-full px-3 md:flex justify-center items-center hidden">
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
      {message.text && (
        <div
          className={`flex justify-center z-50 p-4 rounded-md shadow-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}
      {/* account Cards */}
      {filteredAccounts.length === 0 ? (
        <p className="text-center py-4 text-red-500">No data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentAccounts.map((accountItem, index) => {
            const account = accountItem.itemId;
            const buttonColor =
              account.validIn >= 30 ? "bg-green-500" : "bg-yellow-500";
            return (
              <AccountCard
                key={index}
                title={`Account ${currentPage * accountsPerPage + index + 1}: ${
                  account.title
                }`}
                fees={account.fees}
                validIn={account.validIn}
                onPurchase={() => handlePurchaseClick(accountItem)}
                icon={<FaHandHoldingDollar />}
                button={"Soza Kwishyura"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[830px] gap-[120px] md:pb-0 pt-3 px-10">
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === 0 ? "opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              <FaArrowAltCircleLeft size={24} /> Izibanza
            </button>
          </div>
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === totalPages - 1 ? "opacity-50" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              Izikurira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {selectedAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white rounded-lg shadow-lg md:max-w-3xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
            {paymentStep === "confirmation" ? (
              <></>
            ) : (
              <div className="flex md:flex-row flex-col md:gap-6 gap-1">
                <div className="text-left">
                  <ul className="md:space-y-6 space-y-2 bg-gray-200 h-full p-4">
                    <li className="text-blue-900 font-bold">
                      <input type="radio" name="payment" checked readOnly /> MTN
                      Mobile Money
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center px-3 py-2">
                  <p className="text-start">
                    Kanda ino mibare kuri telefone yawe ukoreshe SIM kadi ya MTN
                    maze <br />
                    wishyure kuri:{" "}
                    <span className="text-md font-semibold text-yellow-700">
                      Vianney MUNYENWARI
                    </span>
                  </p>
                  <p className="flex justify-center md:py-6 py-4 font-bold">
                    <img src={Mtn} alt="" className="w-10 h-6" />
                    *182*1*1*
                    <span className="bg-green-400/20 border border-green-600">
                      0789394424
                    </span>
                    *{selectedAccount.itemId.fees}#
                  </p>
                  <p className="text-md text-Total py-4 font-semibold text-cente">
                    Tanga amakuru kunyemezavbwishyu yawe
                  </p>
                  <div className="w-full text-start">
                    <label htmlFor="phone">Nimero wakoresheje wishyura</label>
                    <input
                      type="text"
                      placeholder="Urugero: 0786731449"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                      value={phoneUsed}
                      onChange={(e) => setPhoneUsed(e.target.value)}
                      required
                    />
                    <label htmlFor="phone">Amazina ibaruyeho</label>
                    <input
                      type="text"
                      placeholder="Urugero: Vianney MUNYENWARI"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full"
                      onClick={handleNotify}
                    >
                      Menyesha Ko Wishyuye
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kumenyekanisha ko wishyuye{" "}
                      <span className="text-Total text-md font-semibold">
                        muminota 5
                      </span>{" "}
                      urahabwa ubutumwa{" "}
                      <span className="text-Total text-md font-semibold">
                        kuri sisiteme hejuru
                      </span>{" "}
                      bukwemerera{" "}
                      <span className="text-Total text-md font-semibold">
                        gukora
                      </span>{" "}
                      ibizamini biri muri {selectedAccount.itemId.title}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolUnpaid;
