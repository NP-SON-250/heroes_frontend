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
import { toast, ToastContainer } from "react-toastify";

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
  const accountsPerPage = 4;
  const navkwigate = useNavigate();

  const fetchAccounts = async () => {
    const token = localStorage.getItem("token");
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

  useEffect(() => {
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
      navkwigate(`/schools/accessableexams?accessCode=${account.accessCode}`);
    } else {
      console.error("No access code available for this account.");
    }
  };
  const makePayment = (invoiceNumber, account) => {
    IremboPay.initiate({
      publicKey: "pk_live_111e50f65489462684098ebea001da06",
      invoiceNumber: invoiceNumber,
      locale: IremboPay.locale.RW,
      callback: async (err, resp) => {
        if (!err) {
          setSelectedAccount(account);
          try {
            const token = localStorage.getItem("token");
            const purchaseId = account._id;

            const response = await axios.put(
              `https://heroes-backend-wapq.onrender.com/api/v1/purchases/${purchaseId}`,
              { status: "complete" },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("Kwishyura byakunze.");
            closePopup();
            navkwigate(`/schools/accounts`);
            fetchAccounts();
          } catch (error) {
            toast.error("Kwishyura byanze.");
            console.error("Ikibazo:", error);
          }
        } else {
          console.error("Payment error:", err);
        }
      },
    });
  };
  const closePopup = () => {
    setSelectedAccount(null);
  };
  const getRemainingDays = (endDate) => {
    if (!endDate) return "N/A";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    return `${diffDays} Days`;
  };
  return (
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>My Accounts</h1>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border text-blue-900 md:text-base text-xs font-bold">
                <th className="px-6 py-2 whitespace-nowrap">No.</th>
                <th className="px-6 py-2 whitespace-nowrap">
                  Izina ry'ikikizamini
                </th>
                <th className="px-6 py-2 whitespace-nowrap">Iminsi izamara</th>
                <th className="px-6 py-2 whitespace-nowrap">
                  Izarangira muminsi
                </th>
                <th className="px-6 py-2 whitespace-nowrap">Itariki</th>
                <th className="px-6 py-2 whitespace-nowrap">Igiciro</th>
                <th className="px-6 py-2 whitespace-nowrap">Imimerere</th>
                <th className="px-6 py-2 whitespace-nowrap">Igikorwa</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((account, index) => {
                const endDate = account.endDate
                  ? new Date(account.endDate)
                  : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const diffDays = endDate
                  ? Math.ceil(
                      (endDate.setHours(0, 0, 0, 0) - today) /
                        (1000 * 60 * 60 * 24)
                    )
                  : null;

                const isExpired = diffDays !== null && diffDays < 0;

                return (
                  <tr
                    key={account._id}
                    className="bg-white border text-blue-900 md:text-base text-xs"
                  >
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {indexOfFirstExam + index + 1}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-xs">
                      {account.itemId?.title}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-x">
                      {account.itemId?.validIn} Days
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap md:tex-md text-x">
                      {getRemainingDays(account.endDate)}
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
                      {isExpired ? (
                        <button className="text-blue-900 py-1 px-3" disabled>
                          -
                        </button>
                      ) : account.status === "pending" ? (
                        <button
                          title="Pay"
                          onClick={() => {
                            makePayment(account.invoiceNumber, account);
                          }}
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
      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[80px] md:pb-0 pt-3 px-10">
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === 1 ? "opacity-50" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaArrowAltCircleLeft size={24} /> Izibanza
            </button>
          </div>
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Izikurira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SchoolMyExams;
