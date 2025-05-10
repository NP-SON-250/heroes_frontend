import React from "react";

const ExamDetailsPopup = ({ exam, onClose }) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">Exam Details</h2>
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Title:</span> {exam.title}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {exam.type}
          </p>
          <p>
            <span className="font-semibold">Number:</span> {exam.number}
          </p>
          <p>
            <span className="font-semibold">Fees:</span> {exam.fees}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(exam.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Number of Questions:</span>{" "}
            {exam.questions?.length}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsPopup;
