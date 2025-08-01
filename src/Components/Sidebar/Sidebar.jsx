import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MdMoreHoriz } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { BsCart } from "react-icons/bs";
import { FaUsersCog } from "react-icons/fa";
import { PiFolderSimpleUserLight, PiExam } from "react-icons/pi";
import { IoIosMenu, IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { MdAccountBalance } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { FaGoogleScholar } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";

const Sidebar = ({ role = "students", onSignOut }) => {
  const location = useLocation();
  const [showAll, setShowAll] = useState(false);

  const handleNavClick = (path) => {
    window.location.href = path;
  };

  const sidebarMenu = {
    students: [
      {
        name: "Ahabanza",
        path: "/students/home",
        iconR: <HiHome />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Isoko ry'ibizamini",
        path: "/students/market",
        iconR: <BsCart />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Aho Bakorera Ikizamini",
        path: "/students/tracking",
        iconR: <PiFolderSimpleUserLight />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Ibizamini Byanjye",
        path: "/students/exams",
        iconR: <IoIosMenu />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Umwirondoro Wanjye",
        path: "/students/profile",
        iconR: <FaUsersCog />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Aho Bagurira konti y'ishuri",
        path: "/students/school",
        iconR: <FaGoogleScholar />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Ibizamini nakoze byose",
        path: "/students/results",
        iconR: <PiExam />,
        iconL: <IoIosArrowForward />,
      },
    ],
    schools: [
      {
        name: "Ahabanza",
        path: "/schools/home",
        iconR: <HiHome />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Isoko rya Konte",
        path: "/schools/account/market",
        iconR: <BsCart />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "gukora Ibizamini",
        path: "/schools/online",
        iconR: <PiFolderSimpleUserLight />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Konte Nishyuye",
        path: "/schools/accounts",
        iconR: <IoIosMenu />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Umwirondoro wa Konte",
        path: "/schools/account",
        iconR: <FaUsersCog />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Ibizamini nakoze byose",
        path: "/schools/results",
        iconR: <PiExam />,
        iconL: <IoIosArrowForward />,
      },
    ],
    admins: [
      {
        name: "Dashboard",
        path: "/admins/home",
        iconR: <MdDashboard />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Exams",
        path: "/admins/exams",
        iconR: <PiExam />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Accounts",
        path: "/admins/accounts",
        iconR: <MdAccountBalance />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Users",
        path: "/admins/users",
        iconR: <FaUsers />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Payments",
        path: "/admins/payments",
        iconR: <FcSalesPerformance />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "My Profile",
        path: "/admins/profile",
        iconR: <FaUsersCog />,
        iconL: <IoIosArrowForward />,
      },
    ],
  };

  const items = sidebarMenu[role] || [];
  const visibleItems = items.slice(0, 2);
  const hiddenItems = items.slice(2);

  return (
    <div className="container relative">
      <div className="w-[300px] h-[82vh] px-4 py-4 overflow-y-auto shadow fixed bottom-[45px] left-0 md:block hidden z-[50]">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="py-[10px]">
              <button
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center w-full text-left px-3 py-1 rounded-full text-md font-medium ${
                  location.pathname === item.path
                    ? " border border-Passed font-extrabold md:text-md"
                    : "text-black"
                }`}
              >
                <span className="mr-3 text-blue-500">{item.iconR}</span>
                {item.name}
                <div className="absolute right-6 text-blue-500">
                  {item.iconL}
                </div>
              </button>
            </li>
          ))}
          <div
            className="flex items-center px-3 fixed bottom-14 cursor-pointer"
            onClick={() => {
              localStorage.clear();
              if (onSignOut) onSignOut();
              window.location.href = "/";
            }}
          >
            <RiLogoutCircleLine className="mr-3 text-blue-500" />
            <p className="text-md font-medium">Sohoka</p>
          </div>
        </ul>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-400 py-1 px-1 md:hidden z-[999]">
        <ul className="flex justify-around items-center">
          {visibleItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center text-lg p-0 rounded-2xl font-medium ${
                  location.pathname === item.path
                    ? "text-xs text-blue-500"
                    : "text-gray-700 text-xs"
                }`}
              >
                <span
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? "text-tblue bg-gray-400 border border-tblue px-3 py-3 rounded-full"
                      : "text-gray-700 bg-white border border-gray-700 px-3 py-3 rounded-full"
                  }`}
                >
                  {item.iconR}
                </span>
                <span
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? "text-tblue font-bold "
                      : "text-gray-700 "
                  }`}
                >
                  {item.name}
                </span>
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex flex-col items-center text-xl font-medium text-gray-700 pr-4 px-3 py-3 pt-5 rounded-full"
            >
              <div className="icon">
                <MdMoreHoriz size={24} />
              </div>
              <span className="text-xs font-bold">Ibindi</span>
            </button>
          </li>
        </ul>
        {showAll && (
          <ul className="fixed bottom-[80px] left-0 w-full bg-white py-1 px-0 grid grid-cols-2 gap-4">
            {hiddenItems.map((item, index) => (
              <li key={index} className="flex justify-center">
                <button
                  onClick={() => {
                    setShowAll(false);
                    handleNavClick(item.path);
                  }}
                  className="flex flex-col items-center text-sm font-medium"
                >
                  <span
                    className={`mr-3 ${
                      location.pathname === item.path
                        ? "text-tblue bg-gray-400 text-blue-500 px-3 py-3 rounded-full"
                        : "border bg-white border-gray-700 text-gray-700 px-3 py-3 rounded-full"
                    }`}
                  >
                    {item.iconR}
                  </span>
                  <span
                    className={`mt-1 text-xs ${
                      location.pathname === item.path
                        ? "text-lg text-blue-500 "
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
