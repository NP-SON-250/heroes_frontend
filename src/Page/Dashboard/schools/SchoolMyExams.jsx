import React, { useState, useEffect } from "react";
import axios from "axios";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import {
  FaCartPlus,
  FaEdit,
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const SchoolMyExams = () => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const accountsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAccounts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          "https://heroes-backend-wapq.onrender.com/api/v1/purchases/user",
          config
        );
        const result = response.data?.data;
        setAllAccounts(Array.isArray(result) ? result : [result]);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    fetchAccounts();
  }, []);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstExam = indexOfLastAccount - accountsPerPage;
  const currentAccounts = allAccounts.slice(
    indexOfFirstExam,
    indexOfLastAccount
  );
  const totalPages = Math.ceil(allAccounts.length / accountsPerPage);

  const handleDoAccount = (account) => {
    if (account.accessCode && account.accessCode.length > 0) {
      navigate(`/schools/accessableexams?accessCode=${account.accessCode}`);
    } else {
      console.error("No access code available for this account.");
    }
  };

  const handlePurchaseClick = (account) => {
    setSelectedAccount(account);
    setPaymentStep("confirmation");
  };

  const handleProceedToPayment = () => {
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedAccount(null);
    setPaymentStep("confirmation");
  };

  // Utility: Calculate remaining days from today to endDate
  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>My Examinations</h1>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border text-blue-900 md:text-base text-xs font-bold">
                <th className="px-6 py-2 whitespace-nowrap">No.</th>
                <th className="px-6 py-2 whitespace-nowrap">Access Code</th>
                <th className="px-6 py-2 whitespace-nowrap">Valid In</th>
                <th className="px-6 py-2 whitespace-nowrap">Days Remain</th>
                <th className="px-6 py-2 whitespace-nowrap">Date</th>
                <th className="px-6 py-2 whitespace-nowrap">Fees</th>
                <th className="px-6 py-2 whitespace-nowrap">Status</th>
                <th className="px-6 py-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((account, index) => {
                const remainingDays = getRemainingDays(account.endDate);
                return (
                  <tr
                    key={account._id}
                    className="bg-white border text-blue-900 md:text-base text-xs"
                  >
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {indexOfFirstExam + index + 1}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {account.accessCode}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-x">
                      {account.itemId?.validIn} Days
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-x">
                      {remainingDays} Days
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {getCurrentDate()}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {account.amount}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {account.status}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      {account.status === "pending" ? (
                        <button
                          title="Proceed to payment"
                          onClick={() => handlePurchaseClick(exam)}
                          className="text-blue-900 py-1 px-3 flex md:tex-xs text-xs items-center gap-2"
                        >
                          <FaCartPlus />
                        </button>
                      ) : account.status === "complete" ? (
                        <button
                          onClick={() => handleDoAccount(account)}
                          className="text-blue-900 py-1 px-3 md:tex-xs text-xs flex items-center gap-2"
                        >
                          <FaEdit />
                        </button>
                      ) : (
                        <button className="text-blue-900 py-1 px-3" disabled>
                          -
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[830px] gap-[250px] md:pb-0 pb-10">
          <button
            className={`px-2 py-1 text-blue-900 rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaArrowAltCircleLeft size={24} />
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}

      {/* Payment Popup */}
      {selectedAccount && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-Total rounded-lg shadow-lg md:max-w-3xl w-full text-center relative">
            <button
              className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
              onClick={closePopup}
            >
              ✖
            </button>
            {paymentStep === "confirmation" ? (
              <>
                <h2 className="text-lg text-start font-bold text-white px-6 pt-6">
                  Dear {selectedAccount.purchasedBy?.lName},
                </h2>
                <p className="mt-0 text-start text-white px-6">
                  Your {selectedAccount.itemId?.title} Account valid in{" "}
                  {selectedAccount.itemId?.validIn} days has been successfully
                  purchased! Please make payment for your bill (
                  {selectedAccount.itemId?.fees} RWF) to get exam access code.
                </p>
                <div className="flex justify-center p-6 mt-12 gap-6">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Pay Later
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={handleProceedToPayment}
                  >
                    Pay Now
                  </button>
                </div>
              </>
            ) : (
              <div className="flex md:flex-row bg-white flex-col md:gap-6 gap-1">
                <div className="text-left">
                  <ul className="md:space-y-6 space-y-2 bg-gray-200 h-full p-4">
                    <li className="text-blue-900 font-bold">
                      <input type="radio" name="payment" checked readOnly /> MTN
                      Mobile Money
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Airtel Money
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Ikarita ya Banki
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Amafaranga mu ntoki
                      / Ejenti
                    </li>
                    <li>
                      <input type="radio" name="payment" /> Konti za banki
                    </li>
                    <img src={Irembo} alt="" className="w-24" />
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-start px-3 py-2">
                  <p className="text-start">
                    Kanda ino mibare kuri telefone yawe ya MTN maze <br />
                    wishyure:
                  </p>
                  <p className="flex justify-center gap-2 md:py-6 font-bold">
                    <img src={Mtn} alt="" className="w-10 h-6" />
                    *182*3*7*
                    <span className="bg-green-400/20 border px-1 border-green-600">
                      880318112865
                    </span>
                    #
                  </p>
                  <p>Cyangwa ushyiremo nomero yawe ya MTM MoMo Maze wishyure</p>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="ex: 0789xxxxxxx"
                      className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
                    />
                    <button className="bg-green-500 text-white px-2 py-1 rounded mt-4 w-full">
                      Ishyura {selectedAccount.itemId?.fees} RWF
                    </button>
                    <p className="text-start py-2 font-medium">
                      Nyuma yo kwemeza kwishyura unyuze kuri Ishyura{" "}
                      {selectedAccount.itemId?.fees}, Uragabwa SMS <br />
                      kuri telefone yawe wemeze maze ushyiremo umubare w'ibanga.
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

export default SchoolMyExams;
