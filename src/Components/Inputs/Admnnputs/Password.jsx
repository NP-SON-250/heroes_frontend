import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Password = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-6 relative">
      <label
        className="block text-gray-700 lg:text-sm text-xl font-bold mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        className="w-full lg:text-sm text-xl px-3 py-2 border rounded-lg focus:outline-none focus:border-desired"
        placeholder="Enter password"
      />
      <div className="absolute lg:top-[38px] top-[48px] right-0 pr-3 flex items-center text-xl leading-5">
        {showPassword ? (
          <EyeSlashIcon
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={togglePasswordVisibility}
          />
        ) : (
          <EyeIcon
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={togglePasswordVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default Password;
