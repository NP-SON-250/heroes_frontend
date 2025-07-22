import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import Irembo from "../../../assets/irembopay.png";
import Mtn from "../../../assets/MTN.jpg";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";

const StudentUnpaid = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");
  const [exam, setExam] = useState({ data: [] });
  const [userName, setUserName] = useState("");
  const [phoneUsed, setPhoneUsed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Get user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(`${user.fName} ${user.lName}`);
    }
  }, []);

  // Fetch unpaid exams
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4700/api/v1/purchases/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({
        text: "Error fetching unpaid exams data",
        type: "error",
      });
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Adjust items per page on screen resize
  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  const filteredExams = exam.data.filter(
    (item) =>
      (type === "" ||
        item.itemId.type?.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || item.itemId.fees?.toString().includes(fees)) &&
      (searchTerm === "" ||
        item.itemId.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemId.fees?.toString().includes(searchTerm) ||
        item.itemId.number?.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    currentPage * examsPerPage,
    (currentPage + 1) * examsPerPage
  );

  const handlePurchaseClick = (exam) => {
    setSelectedExam(exam);
    setPaymentStep("payment");
  };

  const closePopup = () => {
    setSelectedExam(null);
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
      const purchasedDataId = selectedExam._id;
      const paidItem = selectedExam.itemId;

      const notificationMessage = `Dear Admin, Turakumenyesha ko ${userName} yishyuye ikizamini cyitwa ${paidItem.title} cy'ubwoko bwo ${paidItem.type} amafaranga ${paidItem.fees} Rwf akoresheje telephone ${phoneUsed} ibaruye kuri ${ownerName}. Reba ko wayabonye kuri telephone nimero: 0789394424 maze umuhe uburenganzira kuri iyi purchase Id: ${purchasedDataId}. Murakoze!!!!!`;
      const noteTitle = `${userName} requests for approval`;
      const response = await axios.post(
        "http://localhost:4700/api/v1/notification",
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

      const purchaseId = selectedExam._id;

      await axios.put(
        `http://localhost:4700/api/v1/purchases/${purchaseId}`,
        { status: "waitingConfirmation" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.delete(
        `http://localhost:4700/api/v1/unpaidexams/${paidItem._id}`
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
          placeholder="--ubwoko bw'ikizami--"
          value={type}
          onChange={(e) => setType(e.target.value)}
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
            placeholder="---Ubwoko, igiciro, nimero byikizami---"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-blue-500 p-2 rounded-xl w-full"
          />
        </div>
      </div>

      <div className="w-full px-3 pb-3 flex justify-center items-center md:hidden">
        <input
          type="search"
          placeholder="---Ubwoko, igiciro, nimero byikizami---"
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
      {/* Exam Cards */}
      {filteredExams.length === 0 ? (
        <p className="text-center py-4 text-red-500">
          Nta kizamini kitishyuye ufite
        </p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentExams.map((exam, index) => {
            const isLearn = exam.itemId.type?.toLowerCase().includes("kwiga");
            const buttonColor = isLearn ? "bg-yellow-500" : "bg-green-500";
            return (
              <ExamsCard
                key={index}
                title={exam.itemId.title}
                number={exam.itemId.number}
                fees={exam.itemId.fees}
                type={exam.itemId.type}
                onPurchase={() => handlePurchaseClick(exam)}
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
        <div className="flex justify-around md:gap-[900px] gap-[250px] md:pb-0 pb-10">
          <button
            className={`px-2 py-1 text-blue-900 rounded ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <FaArrowAltCircleLeft size={24} />
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}

      {/* Payment Popup */}
      {selectedExam && (
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
                    *{selectedExam.itemId.fees}#
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
                        {selectedExam.itemId.type}{" "}
                      </span>{" "}
                      ikizamini
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

export default StudentUnpaid;
