import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import Police from "../../../assets/heroeslogo.png";
import WelcomeDear from "../../../Components/Cards/WelcomeDear";
import ContinueCard from "../../../Components/Cards/ContinueCard";
import ConfirmCard from "../../../Components/Cards/ConfirmCard";
import axios from "axios";

const ManualTracking = () => {
  const [isSearched, setIsSearched] = useState(false);
  const [examCode, setExamCode] = useState("");
  const [examDetails, setExamDetails] = useState(null);
  const [grantedUsers, setGrantedUsers] = useState(null);
  const [showContinueCard, setShowContinueCard] = useState(false);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navkwigate = useNavigate();

  useEffect(() => {
    if (examCode) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:4700/api/v1/purchases/access/${examCode}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setExamDetails(response.data.data.itemId);
          setGrantedUsers(response.data.data.purchasedBy);
          setNotFound(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setExamDetails(null);
          setGrantedUsers(null);
          setNotFound(true);
        }
      };

      fetchData();
    }
  }, [examCode]);

  const handleSearch = () => {
    setIsSearched(true);
  };

  const handleNotReady = () => {
    setIsSearched(false);
    navkwigate(`/students/tracking`);
  };

  const handleStartExam = () => {
    if (examDetails?.type === "kwiga" || examDetails?.type === "Kwiga") {
      navkwigate(`/livekwiga?code=${examCode}`);
    }
    if (examDetails?.type === "gukora" || examDetails?.type === "Gukora") {
      navkwigate(`/liveExam?code=${examCode}`);
    } else {
      alert("Invalid exam type.");
    }
  };

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
                Shyiramo kode yawe y'ikizamini yemewe
              </p>
              <div className="w-full md:px-3 md:pb-16 flex justify-center items-center px-6 pb-24 relative">
                <input
                  type="search"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  placeholder="Shakisha"
                  className="border-2 px-5 border-blue-500 p-2 rounded-full md:w-1/2 w-full outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute md:right-[240px] right-6 bg-Total cursor-pointer rounded-r-full p-2 text-white"
                >
                  Shaka
                </button>
              </div>
            </div>
          </div>
        ) : notFound ? (
          <p className="text-red-500 text-center font-semibold py-4">
            No exam data found for this access code.
          </p>
        ) : examDetails ? (
          <div className="flex flex-col justify-center p-2">
            <table className="border-collapse border border-gray-500 w-full mt-2">
              <tbody>
                <tr className="bg-gray-100">
                  <td
                    colSpan="2"
                    className="border border-gray-400 px-1 md:text-base text-xs text-center text-blue-800"
                  >
                    Ibiranga Ikizamini
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">
                    Ikizamini
                  </td>
                  <td className="border border-gray-400 p-1">
                    {examDetails?.title}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">
                    Kode y'ikizamini
                  </td>
                  <td className="border border-gray-400 p-1">{examCode}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-1 font-bold">
                    Igiciro cy'ikizamini
                  </td>
                  <td className="border border-gray-400 p-1">
                    {examDetails?.fees}
                  </td>
                </tr>

                {grantedUsers && (
                  <>
                    <tr>
                      <td className="border border-gray-400 px-1 md:text-base text-xs bg-blue-100 text-center text-blue-900">
                        Ibiranga umunyeshuri:
                      </td>
                      <td className="border border-gray-400 px-1 md:text-base text-xs bg-blue-100 text-center text-blue-900">
                        {grantedUsers?.fName}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-1">
                        Amazina ye
                      </td>
                      <td className="border border-gray-400 px-1">
                        {grantedUsers?.fName} {grantedUsers?.lName}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-1">Aho aba</td>
                      <td className="border border-gray-400 px-1">
                        {grantedUsers?.address}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-1">Telefone</td>
                      <td className="border border-gray-400 px-1">
                        {grantedUsers?.phone}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <div className="flex md:flex-row flex-col justify-center w-full items-center gap-4 md:py-2 py-6">
              <p>Ese witeguye gutangira ikizamini?</p>
              <div className="flex gap-6">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 md:w-[100px] w-[80px] rounded-full"
                  onClick={handleNotReady}
                >
                  Oya
                </button>
                <button
                  className="bg-Total text-white px-2 py-1 md:w-[100px] w-[80px] rounded-full"
                  onClick={() => setShowContinueCard(true)}
                >
                  Yego
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center">Exam not found</p>
        )}
      </div>

      {showContinueCard && (
        <ContinueCard
          code={examCode}
          onClose={() => setShowContinueCard(false)}
          onClick={() => {
            setShowContinueCard(false);
            setShowConfirmCard(true);
          }}
          onChange={(e) => setExamCode(e.target.value)}
        />
      )}

      {showConfirmCard && (
        <ConfirmCard
          code={examCode}
          onClose={() => setShowConfirmCard(false)}
          onClick={handleStartExam}
          onChange={(e) => setExamCode(e.target.value)}
        />
      )}
    </div>
  );
};

export default ManualTracking;
