import React, { useState, useEffect } from "react";
import ExamsCard from "../../../Components/Cards/ExamsCard";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../../../Components/LoadingSpinner ";
import { useNavigate } from "react-router-dom";
const StudentMarket = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [examsPerPage, setExamsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");
  const [fees, setFees] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [paymentStep, setPaymentStep] = useState("confirmation");

  const [paid, setPaid] = useState();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPayingLater, setIsPayingLater] = useState(false);
  const [exam, setExam] = useState({ data: [] });
  const [userName, setUserName] = useState("");

  const navkwigate = useNavigate();
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
        "https://heroes-backend-wapq.onrender.com/api/v1/exams",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExam(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateExamsPerPage = () => {
      setExamsPerPage(window.innerWidth >= 768 ? 6 : 2);
    };
    updateExamsPerPage();
    window.addEventListener("resize", updateExamsPerPage);
    return () => window.removeEventListener("resize", updateExamsPerPage);
  }, []);

  const exams = exam.data || [];
  const filteredExams = exams.filter(
    (exam) =>
      (type === "" || exam.type.toLowerCase().includes(type.toLowerCase())) &&
      (fees === "" || exam.fees.toString().includes(fees)) &&
      (searchTerm === "" ||
        exam.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.fees.toString().includes(searchTerm) ||
        exam.number.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    currentPage * examsPerPage,
    (currentPage + 1) * examsPerPage
  );

  const handlePurchaseClick = (exam) => {
    setSelectedExam(exam);
    setPaymentStep("confirmation");
  };

  const handleProceedToPayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://heroes-backend-wapq.onrender.com/api/v1/purchases/${selectedExam._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentStep("payment");
      setPaid(response.data?.data?.purchase._id);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("You have already purchased this exam.");
      } else {
        console.error("Purchase request failed:", error);
        alert("Failed to initiate purchase. Please try again.");
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const purchasedItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const purchasedId = paid;
      const response = await axios.get(
        `https://heroes-backend-wapq.onrender.com/api/v1/purchases/${purchasedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data?.invoiceNumber) {
        const invoiceNumbers = response.data.data.invoiceNumber;
        return invoiceNumbers;
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const makePayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);
    try {
      const invoiceNumber = await purchasedItem();

      if (!invoiceNumber) {
        toast.error("No invoice number available");
        return;
      }

      IremboPay.initiate({
        publicKey: "pk_live_111e50f65489462684098ebea001da06",
        invoiceNumber: invoiceNumber,
        locale: IremboPay.locale.RW,
        callback: async (err, resp) => {
          if (!err) {
            try {
              const token = localStorage.getItem("token");
              const purchasedId = paid;

              const response = await axios.put(
                `https://heroes-backend-wapq.onrender.com/api/v1/purchases/${purchasedId}`,
                { status: "complete" },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              toast.success("Kwishyura byakunze.");
              closePopup();
              navkwigate(`/students/waitingexams`);
              fetchData();
            } catch (error) {
              toast.error("Kwishyura byanze.");
              console.error("Ikibazo:", error);
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessingPayment(false);
    }
  };
  const handlePayLaterClick = async () => {
    if (isPayingLater) return;

    setIsPayingLater(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://heroes-backend-wapq.onrender.com/api/v1/purchases/${selectedExam._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closePopup();
    } catch (error) {
      console.log(error);
    } finally {
      setIsPayingLater(false);
    }
  };

  const closePopup = () => {
    setSelectedExam(null);
    setPaymentStep("confirmation");
  };

  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />

      <div className="grid md:grid-cols-3 grid-cols-2 justify-between items-center md:gap-12 gap-1 px-3 py-4">
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
        <div className="w-full px-3 md:flex justify-center items-center hidden md:bloc">
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

      {filteredExams.length === 0 ? (
        <p className="text-center py-4 text-red-500">No data found</p>
      ) : (
        <div className="grid md:grid-cols-3 w-full gap-4 md:gap-3 py-1">
          {currentExams.map((exam, index) => {
            const iskwiga = exam.type.toLowerCase().includes("kwiga");
            const buttonColor = iskwiga ? "bg-yellow-500" : "bg-green-500";
            return (
              <ExamsCard
                key={index}
                {...exam}
                onPurchase={() => handlePurchaseClick(exam)}
                icon={<BsCart />}
                button={"Gura Ikizami"}
                buttonColor={buttonColor}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            <FaArrowAltCircleLeft size={24} /> Ibibanza
          </button>
          <button
            className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Ibikurikira
            <FaArrowAltCircleRight size={24} />
          </button>
        </div>
      )}

      {selectedExam && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-Total rounded-lg shadow-lg md:max-w-3xl w-full text-center relative">
            {paymentStep === "confirmation" ? (
              <>
                <button
                  className="absolute top-1 right-1 text-xl bg-white text-red-700 border-2 border-white rounded-full w-8 h-8 flex justify-center"
                  onClick={closePopup}
                >
                  ✖
                </button>
                <h2 className="text-lg text-start font-bold text-white px-6 pt-6">
                  Mukiriya {userName?.fName} {userName?.lName},
                </h2>
                <p className="mt-0 text-start text-white px-6">
                  Ugiye kugura ikizamini {selectedExam.number} cyo{" "}
                  {selectedExam.type} ishyura ayamafaranga ({selectedExam.fees}{" "}
                  RWF) maze uhabwe kode yo gufungura ikizamini cyawe. Ufite
                  ikibazo hamagara kuri iyi nimero: 0783905790
                </p>
                <div className="flex justify-center md:p-6 p-2 md:mt-12 mt-6 mb-2 md:gap-20 gap-6">
                  <button
                    className={`bg-yellow-500 text-white px-2 py-1 rounded ${
                      isPayingLater ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handlePayLaterClick}
                    disabled={isPayingLater}
                  >
                    {isPayingLater ? <LoadingSpinner /> : "Ishyura Mukanya"}
                  </button>
                  <button
                    className={`bg-green-500 text-white px-2 py-1 rounded ${
                      isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleProceedToPayment}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <LoadingSpinner />
                    ) : (
                      "Ishyura Nonaha"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col pb-14">
                <h2 className="text-lg text-start font-bold text-white px-6 pt-6">
                  Mukiriya {userName?.fName} {userName?.lName},
                </h2>
                <p className="mt-0 text-start text-white px-6">
                  Ugiye kugura ikizamini {selectedExam.number} cyo{" "}
                  {selectedExam.type} ishyura ayamafaranga ({selectedExam.fees}{" "}
                  RWF) maze uhabwe kode yo gufungura ikizamini cyawe. Ufite
                  ikibazo hamagara kuri iyi nimero:{" "}
                  <span className="text-yellow-600 font-semibold pl-2">
                    0783905790
                  </span>
                </p>
                <div className="flex justify-center md:gap-24 gap-10 pt-10">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={closePopup}
                  >
                    Hagarika kwishyura
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={makePayment}
                  >
                    Soza Kwishyura
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StudentMarket;
