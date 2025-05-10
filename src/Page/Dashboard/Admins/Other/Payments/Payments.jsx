import React, { useState, useEffect } from "react";
import axios from "axios";

const PAYMENTS_PER_PAGE = 4;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "https://congozi-backend.onrender.com/api/v1/purchases/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data;
        const mapped = data.data.map((item) => ({
          id: item._id,
          payer: item.purchasedBy
            ? `${item.purchasedBy.fName} ${item.purchasedBy.lName}`
            : "Anonymous",
          amount: `RWF ${item.amount}`,
          startedOn: new Date(item.startDate).toISOString().split("T")[0],
          expiresOn: item.endDate
            ? new Date(item.endDate).toISOString().split("T")[0]
            : "No expires",
          purchasedItem: item.itemType,

          status: item.status === "complete" ? "Completed" : "Pending",
        }));
        setPayments(mapped);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      }
    };
    fetchPayments();
  }, []);

  const indexOfLastPayment = currentPage * PAYMENTS_PER_PAGE;
  const indexOfFirstPayment = indexOfLastPayment - PAYMENTS_PER_PAGE;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(payments.length / PAYMENTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="md:px-6 py-6 px-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Payments</h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-1 whitespace-nowrap">Payer</th>
              <th className="px-6 py-1 whitespace-nowrap">Amount</th>
              <th className="px-6 py-1 whitespace-nowrap">Purchased Item</th>
              <th className="px-6 py-1 whitespace-nowrap">Paid On</th>
              <th className="px-6 py-1 whitespace-nowrap">Expires On</th>
              <th className="px-6 py-1 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-1 whitespace-nowrap">{payment.payer}</td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.amount}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-center">
                  {payment.purchasedItem}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.startedOn}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  {payment.expiresOn}
                </td>
                <td className="px-6 py-1 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Payments;
