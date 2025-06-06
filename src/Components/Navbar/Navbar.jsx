import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { navContents } from "../../Data/morkData";
import { MdMenu, MdOutlineClose } from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isDisabled = location.pathname === "/kwinjira";

  return (
    <>
      <div className="fixed top-0 left-0 bg-Total z-50 w-full shadow-md">
        <div className="flex container justify-between items-center">
          {/* Logo Section */}
          <div className="flex justify-center items-center md:px-0 px-4">
            <Link to={"/"}>
              <img src={Logo} alt="" className="w-14 py-1" />
            </Link>
          </div>

          {/* Menu Section */}
          <div className="md:block hidden py-1 px-10">
            <ul className="flex items-center gap-6 text-white">
              {navContents.map((items) => {
                const isActive = location.pathname === items.link;
                return (
                  <li key={items.id}>
                    <a
                      href={items.link}
                      className={`inline-block px-3 font-medium ${
                        isActive ? "text-Unpaid/95" : "hover:text-Unpaid/95"
                      }`}
                    >
                      {items.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Button Section */}
          <Link to={"/kwinjira"}>
            <div
              className={`flex justify-center items-center text-white hover:text-yellow-700 gap-2 px-2 py-1 rounded-3xl cursor-pointer ${
                isDisabled
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:text-yellow-700"
              }`}
            >
              {/* Icon */}
              <div className="bg-Unpaid/95 hover:bg-white w-6 h-6 p-2 flex justify-center items-center rounded-full">
                <FaUser />
              </div>
              <button
                className={`text-xl  pr-4 font-semibold ${
                  isDisabled ? "opacity-50 cursor-pointer" : ""
                }`}
                disabled={isDisabled}
              >
                Kwinjira
              </button>
            </div>
          </Link>

          {/* Mobile hamburger menu Section */}
          <div className="md:hidden" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? (
              <MdOutlineClose className=" text-white hover:text-Unpaid/95 pr-4 cursor-pointer text-5xl" />
            ) : (
              <MdMenu className="text-white hover:text-Unpaid/95 text-5xl cursor-pointer pr-4" />
            )}
          </div>
        </div>
      </div>

      {/* Responsive side */}
      <ResponsiveMenu isOpen={isOpen} />
    </>
  );
};

export default Navbar;
