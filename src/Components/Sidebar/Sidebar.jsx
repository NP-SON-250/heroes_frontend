import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { MdMoreHoriz } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { BsCart } from "react-icons/bs";
import { FaUsersCog } from "react-icons/fa";
import { PiFolderSimpleUserLight, PiExam } from "react-icons/pi";
import { IoIosMenu, IoIosArrowForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { MdManageAccounts, MdAccountBalance } from "react-icons/md";
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
        name: "Home",
        path: "/students/home",
        iconR: <HiHome />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Examination Market",
        path: "/students/market",
        iconR: <BsCart />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Do Exams Online",
        path: "/students/tracking",
        iconR: <PiFolderSimpleUserLight />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "My Examinations",
        path: "/students/exams",
        iconR: <IoIosMenu />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "My Profile",
        path: "/students/profile",
        iconR: <FaUsersCog />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "School Account Market",
        path: "/students/school",
        iconR: <FaGoogleScholar />,
        iconL: <IoIosArrowForward />,
      },
    ],
    schools: [
      {
        name: "Home",
        path: "/schools/home",
        iconR: <HiHome />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Account Market",
        path: "/schools/account/market",
        iconR: <BsCart />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "Do Exams Online",
        path: "/schools/online",
        iconR: <PiFolderSimpleUserLight />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "My Examinations",
        path: "/schools/exams",
        iconR: <IoIosMenu />,
        iconL: <IoIosArrowForward />,
      },
      {
        name: "My Profile",
        path: "/schools/account",
        iconR: <FaUsersCog />,
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
      {/* Desktop Sidebar */}
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
            <p className="text-md font-medium">Sign Out</p>
          </div>
        </ul>
      </div>

      {/* Mobile Bottom Navigation */}
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
              <span className="text-xs font-bold">More</span>
            </button>
          </li>
        </ul>

        {/* More Items Dropdown */}
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
