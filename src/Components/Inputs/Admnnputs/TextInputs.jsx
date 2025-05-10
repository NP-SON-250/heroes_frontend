import React from "react";

const TextInputs = (label, id, type, placeholder, onChange) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 lg:text-sm text-xl font-bold mb-2"
        htmlFor="email"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full lg:text-sm text-xl px-3 py-2 border rounded-lg focus:outline-none focus:border-desired"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInputs;
