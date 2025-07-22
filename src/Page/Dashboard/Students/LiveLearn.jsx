import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LuCircleArrowLeft } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import DescriptionCard from "../../../Components/Cards/DescriptionCard";
import ExamTimer from "../../../Components/ExamTimer";

const LiveLearn = () => {
  const [examCode, setExamCode] = useState("");
  const [paidExam, setPaidExam] = useState(null);
  const [examToDo, setExamToDo] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [showNoQuestionsMessage, setShowNoQuestionsMessage] = useState(false);

  const location = useLocation();
  const navkwigate = useNavigate();

  const token = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return "";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code") || "";
    setExamCode(code);
  }, [location.search]);

  useEffect(() => {
    const fetchPaidExam = async () => {
      try {
        const res = await axios.get(
          `https://heroes-backend-wapq.onrender.com/api/v1/purchases/access/${examCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPaidExam(res.data.data.itemId);
      } catch (error) {
        console.error("Error fetching paid exam:", error);
      }
    };
    if (examCode) fetchPaidExam();
  }, [examCode, token]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const examId = paidExam?.examId || paidExam?._id;
        if (!examId) return;
        const res = await axios.get(
          `https://heroes-backend-wapq.onrender.com/api/v1/exams/${examId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const examData = res.data.data;
        setExamToDo(examData);
        if (typeof window !== "undefined") {
          localStorage.setItem("live_exam_data", JSON.stringify(examData));
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    if (paidExam) fetchExamDetails();
  }, [paidExam, token]);

  useEffect(() => {
    if (examToDo && examCode) {
      const questions = examToDo.questions || [];
      setExamQuestions(questions);

      if (questions.length === 0) {
        setShowNoQuestionsMessage(true);
      }
    }
  }, [examToDo, examCode]);

  const fetchgGukoraExam = useCallback(async () => {
    try {
      const number = paidExam?.number;
      if (!number) return;

      const purchaseRes = await axios.get(
        "https://heroes-backend-wapq.onrender.com/api/v1/purchases/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const purchasedExams = purchaseRes.data.data;
      const examPurchased = purchasedExams.some(
        (p) => p.accessCode === examCode
      );
      if (!examPurchased) return;

      const res = await axios.get(
        `https://heroes-backend-wapq.onrender.com/api/v1/exams/gukora/${number}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const gukoraData = res.data.data;
      fetchgGukoraExam(gukoraData);
      if (typeof window !== "undefined") {
        localStorage.setItem("gukora_exam_data", JSON.stringify(gukoraData));
      }
    } catch (error) {
      console.error("Error fetching gukora exam:", error);
    }
  }, [examCode, paidExam, token]);

  const currentQuestion = useMemo(
    () => examQuestions[selectedQuestion],
    [selectedQuestion, examQuestions]
  );

  const handleTimeout = useCallback(async () => {
    try {
      if (examCode) {
        await axios.delete(
          `https://heroes-backend-wapq.onrender.com/api/v1/purchases/access/${examCode}`
        );
        navkwigate("/students/waitingexams", {
          replace: true,
          state: { reset: true },
        });
      }
    } catch (error) {
      console.error("Error deleting exam purchase on timeout:", error);
    }
    localStorage.removeItem(`selectedAnswers_${examCode}`);
  }, [examCode, navkwigate]);

  return (
    <div className="flex flex-col bg-white md:p-2 gap-2">
      {showNoQuestionsMessage ? (
        <div className="text-center mt-10 text-Total font-semibold">
          <p>Ikikizami ntabibazo gifite. Hamagara Admin</p>
          <p>
            kuri: <span className="text-orange-500">0789394424</span>
          </p>
        </div>
      ) : (
        <>
          <>
            <h1 className="md:text-xl text-center md:py-1 py-3 font-bold text-Total capitalize">
              Ibisubizo by'ukuri biri mu ibara ry'icyatsi
            </h1>
            <DescriptionCard
              questions={examQuestions.length}
              total20={examQuestions.length * 1}
              total100={examQuestions.length * 5}
              pass20={((12 / 20) * examQuestions.length).toFixed(0)}
              pass100={((60 / 20) * examQuestions.length).toFixed(0)}
              number={examToDo?.number}
              type={examToDo?.type}
              timeLeft={
                <ExamTimer
                  accessCode={examCode}
                  duration={10}
                  onTimeout={handleTimeout}
                />
              }
              access={examCode}
            />
          </>

          <div className="w-full px-3">
            {currentQuestion ? (
              <>
                <h3 className="mb-0 md:text-md text-sm font-semibold">
                  Q{selectedQuestion + 1}. {currentQuestion.phrase}
                </h3>
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="question"
                    className="w-32 h-32 rounded-md mb-1"
                  />
                )}
                <form className="space-y-1 md:text-md text-sm">
                  {currentQuestion.options.map((option, index) => {
                    const optionLabels = [
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                      "G",
                      "H",
                    ];
                    const label = optionLabels[index];
                    const isCorrect = option.isCorrect;

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <label
                          htmlFor={`option-${index}`}
                          className={`cursor-pointer ${
                            isCorrect ? "text-green-600 font-semibold" : ""
                          }`}
                        >
                          <span className="capitalize">{label}:</span>{" "}
                          {option.text}
                        </label>
                      </div>
                    );
                  })}
                </form>

                <div className="mt-4 md:flex md:justify-between grid grid-cols-2 gap-4 md:pb-0 pb-4">
                  <button
                    onClick={() =>
                      setSelectedQuestion((prev) => Math.max(prev - 1, 0))
                    }
                    className={`bg-blue-900 text-white px-2 py-1 rounded flex justify-center items-center gap-2
                                            ${
                                              selectedQuestion === 0
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-blue-900"
                                            }`}
                    disabled={selectedQuestion === 0}
                  >
                    <LuCircleArrowLeft />
                    Ikibanza
                  </button>
                  <button
                    onClick={() =>
                      setSelectedQuestion((prev) =>
                        Math.min(prev + 1, examQuestions.length - 1)
                      )
                    }
                    className={`bg-blue-900 text-white px-1 py-1 rounded flex justify-center  items-center gap-2
                                            ${
                                              selectedQuestion ===
                                              examQuestions.length - 1
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-blue-900"
                                            }`}
                    disabled={selectedQuestion === examQuestions.length - 1}
                  >
                    <FiArrowRightCircle /> Igikurikira
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default LiveLearn;
