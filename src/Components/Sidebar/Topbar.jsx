import React, { useState, useEffect } from "react";
import { AiOutlineNotification } from "react-icons/ai";
import { PiFolderOpenDuotone } from "react-icons/pi";
import { IoLanguageOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const Topbar = ({ currentSection, role = "students", onSignOut, onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    window.location.href = path;
  };
  
  const studentTop = [
    {
      id: 1,
      name: "Notification",
      path: "/students/notifications",
      icon: <AiOutlineNotification />,
    },
    {
      id: 2,
      name: "Language",
      path: "#",
      icon: <IoLanguageOutline />,
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
      }
    }
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback behavior if onLogout isn't provided
      const isConfirmed = window.confirm("Are you sure you want to logout?");
      if (isConfirmed) {
        localStorage.clear();
        if (onSignOut) onSignOut();
        setUser(null);
        navigate("/kwinjira", { replace: true });
      }
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 md:px-24 px-4 flex justify-between items-center w-full h-[11vh] shadow bg-Total`}
      style={{ zIndex: 999 }}
    >
      {/* Logo and Role */}
      <div className="flex justify-center items-center gap-5">
        <Link to={`/${role}/home`}>
          <img src={Logo} alt="Logo" className="h-12 text-center" />
        </Link>
        <div className="text-xs font-bold text-white">{currentSection}</div>
      </div>

      {/* Menu Items */}
      <div className="flex justify-between items-center">
        <div className="hidden md:block">
          <ul className="flex items-center gap-6 text-gray-600 border border-Waiting rounded-md">
            {studentTop.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className="flex justify-center items-center gap-2 py-1 text-xs px-3 hover:text-Unpaid/95 text-white font-semibold"
                >
                  {item.icon}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Profile */}
        <div
          className="flex justify-center items-center gap-2 cursor-pointer md:hidden"
          onClick={toggleMenu}
        >
          {user?.profile ? (
            <img
              src={
                user.profile ||
                "https://res.cloudinary.com/da12yf0am/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740671685/SBS%20Images/file_limbge.webp"
              }
              alt={user.companyName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
              <span className="text-xs font-bold">
                {user?.companyName?.[0]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuVisible && (
        <div className="absolute top-[11vh] right-0 w-full bg-gray-800 py-4 md:hidden z-[999]">
          <div className="flex flex-col justify-center items-center gap-1 mb-4">
            {user?.profile ? (
              <img
                src={
                  user.profile ||
                  "https://res.cloudinary.com/da12yf0am/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740671685/SBS%20Images/file_limbge.webp"
                }
                alt={user.companyName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="bg-white text-blue-500 p-4 rounded-full flex justify-center items-center text-xs font-bold">
                {user?.companyName?.[0]}
              </div>
            )}
            <div className="text-xs font-bold text-white">
              {user?.companyName || user?.fName}
            </div>
          </div>

          <ul className="flex flex-col items-start gap-4 text-white px-4">
            {studentTop.map((item) => (
              <li key={item.id}>
                <a
                  href={item.path}
                  className="flex gap-2 py-2 hover:text-Unpaid/95 font-semibold"
                >
                  {item.icon}
                  {item.name}
                </a>
              </li>
            ))}
            <div
              className="flex items-center px-3 pt-28 cursor-pointer"
              onClick={handleLogoutClick}
            >
              <PiFolderOpenDuotone className="mr-3 text-whte" />
              <p className="text-md font-medium">Log Out</p>
            </div>
          </ul>
        </div>
      )}

      {/* Desktop Profile */}
      <div className="hidden md:flex flex-col justify-center items-center gap-0">
        {user?.profile ? (
          <img
            src={
              user.profile ||
              "https://res.cloudinary.com/da12yf0am/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740671685/SBS%20Images/file_limbge.webp"
            }
            alt={user.companyName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="bg-white text-blue-500 p-2 rounded-full flex justify-center items-center">
            <span className="text-xs font-bold">{user?.companyName?.[0]}</span>
          </div>
        )}
        <div className="text-xs font-bold text-white">
          {user?.companyName || user?.fName}
        </div>
      </div>
    </div>
  );
};

export default Topbar;