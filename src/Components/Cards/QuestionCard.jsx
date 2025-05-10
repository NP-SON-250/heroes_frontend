import React from "react";

const QuestionCard = ({ bgColor, textColor, onClick, values, onChange }) => {
  return (
    <>
      <button
        className={`flex flex-row gap-0 py-2 md:py-0 px-2 justify-center items-center rounded-md w-20 h-10 ${bgColor} ${textColor}`}
        onClick={onClick}
        onChange={onChange}
      >
        <p>Ikabazo</p>
        <p>:{values}</p>
      </button>
    </>
  );
};

export default QuestionCard;
