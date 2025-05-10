import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import Police from "../../../assets/Policelogo.png";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import ContinueCard from "../../../Components/Cards/ContinueCard";
import ConfirmCard from "../../../Components/Cards/ConfirmCard";
import axios from "axios";
const SchoolAccessedExam = () => {
  const [isSearched, setIsSearched] = useState(false);
  const [examId, setExamId] = useState("");
  const [userName, setUserName] = useState("");

  const [showContinueCard, setShowContinueCard] = useState(false);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [exam, setExam] = useState({ data: [] });
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  useEffect(() => {
    const initialExamId = params.get("id") || "";
    setExamId(initialExamId);
  }, [params]);

  useEffect(() => {
    if (examId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `https://congozi-backend.onrender.com/api/v1/exams/${examId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setExam(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [examId]);

  const handleSearch = () => {
    setIsSearched(true);
  };

  const handleNotReady = () => {
    setExamId("");
    setIsSearched(false);
    navigate(`/schools/accessedexam`);
  };

  const handleStartExam = () => {
    if (exam?.type === "Learn" || exam?.type === "learn") {
      navigate(`/schoolsliveLearn?id=${examId}`);
    } else if (exam?.type === "Test" || exam?.type === "test") {
      navigate(`/schoolsliveExam?id=${examId}`);
    } else {
      alert("Invalid exam type.");
    }
  };

  const handleShowContinueCard = () => {
    setShowContinueCard(true);
  };
  const handleCloseContinueCard = () => {
    setShowContinueCard(false);
  };

  const handleShowConfirmCard = () => {
    setShowContinueCard(false);
    setShowConfirmCard(true);
  };
  const handleCloseConfirmCard = () => {
    setShowConfirmCard(false);
  };

  // Get user info from localStorage
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
  return (
    <div className="flex flex-col justify-center items-center md:px-5 gap-1 bg-white md:p-2">
      <WelcomeDear />

      <div className="flex flex-col gap-2 w-full border border-gray-400 rounded-md md:mt-2 mt-16">
        <div className="flex justify-center items-center gap-3 border border-gray-400 text-center w-full bg-blue-100 py-0 rounded-md">
          <MdOutlineContentPasteSearch size={24} className="text-blue-900" />
          <h1 className="text-center md:text-3xl text-base text-blue-900">
            Examination Tracking Center
          </h1>
        </div>

        {!isSearched ? (
          <div className="flex flex-col justify-center">
            <div className="flex justify-center items-center">
              <img src={Police} alt="Police Logo" className="w-24 py-3" />
            </div>
            <div className="flex flex-col gap-4">
              <p className="capitalize font-bold text-lg text-center">
                Enter your examination access id
              </p>
              <div className="w-full md:px-3 md:pb-16 flex justify-center items-center px-6 pb-24 relative">
                <input
                  type="search"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  placeholder="Search exam code"
                  className="border-2 px-5 border-blue-500 p-2 rounded-full md:w-1/2 w-full outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute md:right-[240px] right-6 bg-blue-500 cursor-pointer rounded-r-full p-2 text-white"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center p-2">
            {exam ? (
              <div>
                <table className="border-collapse border border-gray-500 w-full mt-2">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td
                        colSpan="2"
                        className="border border-gray-400 px-1 md:text-base text-xs text-center text-blue-800"
                      >
                        Examination Details
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-1 font-bold">
                        Exam Title
                      </td>
                      <td className="border border-gray-400 p-1">
                        {exam.title}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-1 font-bold">
                        Exam Access Id
                      </td>
                      <td className="border border-gray-400 p-1">{examId}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-1 font-bold">
                        Fees
                      </td>
                      <td className="border border-gray-400 p-1">
                        {exam.fees}
                      </td>
                    </tr>

                    {userName && (
                      <>
                        <tr>
                          <td className="border border-gray-400 px-1 md:text-base text-xs bg-blue-100 text-start text-blue-900">
                            School Granted:
                          </td>
                          <td className="border border-gray-400 px-1 md:text-base text-xs bg-blue-100 text-start text-blue-900">
                            {userName?.companyName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-1">
                            School Owner
                          </td>
                          <td className="border border-gray-400 px-1">
                            {userName?.companyName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-1">
                            School Address
                          </td>
                          <td className="border border-gray-400 px-1">
                            {userName?.address}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-1">
                            School Phone
                          </td>
                          <td className="border border-gray-400 px-1">
                            {userName.phone}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <div className="flex md:flex-row flex-col justify-center w-full items-center gap-4 md:py-2 py-6">
                  <p>Are you ready to start the exam?</p>
                  <div className="flex gap-6">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 md:w-[100px] w-[80px] rounded-full"
                      onClick={handleShowContinueCard}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 md:w-[200px] w-[160px] rounded-full"
                      onClick={handleNotReady}
                    >
                      I'm Not Ready
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-center">Exam not found</p>
            )}
          </div>
        )}
      </div>

      {/* Continue Card Popup */}
      {showContinueCard && (
        <ContinueCard
          code={examId}
          onClose={handleCloseContinueCard}
          onClick={handleShowConfirmCard}
          onChange={(e) => setExamId(e.target.value)}
        />
      )}

      {/* Confirm Card Popup */}
      {showConfirmCard && (
        <ConfirmCard
          code={examId}
          onClose={handleCloseConfirmCard}
          onClick={handleStartExam}
          onChange={(e) => setExamId(e.target.value)}
        />
      )}
    </div>
  );
};

export default SchoolAccessedExam;
