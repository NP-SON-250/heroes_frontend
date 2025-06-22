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

const StudentExams = () => {
  const [allExams, setAllExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const examsPerPage = 5;
  const navkwigate = useNavigate();

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
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
      setAllExams(Array.isArray(result) ? result : [result]);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = allExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(allExams.length / examsPerPage);

  const handlekwigaExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      navkwigate(`/livekwiga?code=${exam.accessCode}`);
    } else {
      console.error("No access code available for this exam.");
    }
  };

  const makePayment = (invoiceNumber, exam) => {
    IremboPay.initiate({
      publicKey: "pk_live_111e50f65489462684098ebea001da06",
      invoiceNumber: invoiceNumber,
      locale: IremboPay.locale.RW,
      callback: async (err, resp) => {
        if (!err) {
          setSelectedExam(exam);
          try {
            const token = localStorage.getItem("token");
            const purchaseId = exam._id;

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
            navkwigate(`/students/exams`);
            fetchExams();
          } catch (error) {
            toast.error("Kwishyura byanze.");
            console.error("Ikibazo:", error);
          }
        } else {
          toast.error("Payment failed");
          console.error("Payment error:", err);
        }
      },
    });
  };

  const handleDoExam = (exam) => {
    if (exam.accessCode && exam.accessCode.length > 0) {
      navkwigate(`/liveExam?code=${exam.accessCode}`);
    } else {
      console.error("No access code available for this exam.");
    }
  };

  const closePopup = () => {
    setSelectedExam(null);
  };
  return (
    <div className="md:p-2 flex gap-2 flex-col">
      <WelcomeDear />
      <div className="flex justify-center items-center gap-4 text-blue-900 font-bold py-2 border bg-gray-100 rounded-md">
        <h1>Ibizamini Byanjye</h1>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-blue-900">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border text-blue-900 md:text-base text-xs font-bold">
                <th className="text-center p-2 whitespace-nowrap">No.</th>
                <th className="text-center p-2 whitespace-nowrap">
                  Umutwe w'ikizami
                </th>
                <th className="text-center p-2 whitespace-nowrap">Ubwoko</th>
                <th className="text-center p-2 whitespace-nowrap">Itariki</th>
                <th className="text-center p-2 whitespace-nowrap">Igiciro</th>
                <th className="text-center p-2 whitespace-nowrap">Imimerere</th>
                <th className="text-center p-2 whitespace-nowrap">Igikorwa</th>
              </tr>
            </thead>
            <tbody>
              {currentExams.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-red-500 font-semibold"
                  >
                    Ntakizamini uragura.
                  </td>
                </tr>
              ) : (
                currentExams.map((exam, index) => (
                  <tr
                    key={exam._id}
                    className="bg-white border text-blue-900 md:text-base text-xs whitespace-nowrap"
                  >
                    <td className="text-center md:tex-md text-xs py-2 px-4 whitespace-nowrap">
                      {indexOfFirstExam + index + 1}
                    </td>
                    <td className="text-start md:tex-md text-xs px-1 whitespace-nowrap">
                      {exam.itemId?.title}
                    </td>
                    <td className="text-start md:tex-md text-xs p-2 whitespace-nowrap">
                      {exam.itemId?.type}
                    </td>
                    <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                      {getCurrentDate()}
                    </td>
                    <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                      {exam.amount} Rwf
                    </td>
                    <td className="text-start md:tex-md text-xs px-2 whitespace-nowrap">
                      {exam.status}
                    </td>
                    <td className="text-center p-2 whitespace-nowrap">
                      {exam.status === "pending" ? (
                        <button
                          title="Pay"
                          onClick={() => {
                            makePayment(exam.invoiceNumber, exam);
                          }}
                          className="text-blue-900 py-1 px-3 flex md:tex-xs text-xs items-center gap-2"
                        >
                          <FaCartPlus />
                        </button>
                      ) : exam.status === "complete" &&
                        exam.itemId?.type === "gukora" ? (
                        <button
                          onClick={() => handleDoExam(exam)}
                          className="text-blue-900 py-1 px-3 md:tex-xs text-xs flex items-center gap-2"
                        >
                          <FaEdit />
                        </button>
                      ) : exam.status === "complete" &&
                        exam.itemId?.type === "kwiga" ? (
                        <button
                          onClick={() => handlekwigaExam(exam)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-around md:gap-[700px] gap-[120px] md:pb-0 pt-3 px-10">
          <div>
            <button
              className={`px-2 py-1 text-blue-900 rounded flex justify-center itemes-center gap-2 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaArrowAltCircleLeft size={24} />
              Ibibanza
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
              Ibikurikira
              <FaArrowAltCircleRight size={24} />
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StudentExams;
