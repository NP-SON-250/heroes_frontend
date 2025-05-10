import React from "react";

const DescriptionCard = ({access,questions,total20,total100,pass20,pass100,number,type,timeLeft}) => {
  return (
    <div className="text-blue-900 bg-green-500 p-1 rounded-md">
      <div className="flex flex-wrap justify-center gap-2 w-full py-1 md:px-12 px-2">
        <p>Exam Access Code: {access}</p>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2 gap-2 w-full py-0 md:px-12 px-2">
        <p>Total Questions: {questions}</p>
        <p>Total Marks:{total20}/20</p>
        <p>Total Marks: {total100}/100</p>
        <p>Pass Marks: {pass20}/20</p>
        <p>Pass Marks: {pass100}/100 </p>
        <p>Exam Number: {number}</p>
        <p>Exam Type: {type}</p>
        <div className="flex flex-row">
          Exam Time:{" "}
          <span className="bg-white px-1 rounded-full text-blue-900 font-extrabold">
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;
