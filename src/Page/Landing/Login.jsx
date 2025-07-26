import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { IoIosLogIn } from "react-icons/io";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";
import LoginInputs from "../../Components/Inputs/Studentnputs/LoginInputs";
import Injira from "../../assets/Injira.png";
import { useUserContext } from "../../Components/useUserContext";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast.error("Shyiramo nomero ya telefone n'ijambo banga");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4700/api/v1/users/auth",
        {
          identifier,
          password,
        }
      );

      const { token, data, message } = response.data;

      // Update both localStorage and context
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      toast.success(message || "Kwinjira byakunze");

      // Role-based redirect
      switch (data.role) {
        case "student":
          navigate("/students/home");
          window.location.reload();
          break;
        case "admin":
          navigate("/admins/home");
          window.location.reload();
          break;
        case "school":
          navigate("/schools/home");
          window.location.reload();
          break;
        case "supperAdmin":
          navigate("/admins/home");
          window.location.reload();
          break;
        default:
          toast.error("Ntitwabashije kumenya uw'uriwe");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Kwinjira byanze ongera ugerageze.";
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    // Redirect if user is already logged out
    const token = localStorage.getItem("token");
    if (!token) {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };
    }
  }, []);

  return (
    <div className=" pt-20 md:px-12">
      <div className="grid md:grid-cols-2 grid-cols-1 rounded-r-md rounded-b-none md:border border-blue-700">
        <div className="flex justify-end md:h-[60vh]">
          <img src={Injira} alt="Login Illustration" />
        </div>

        <div className="flex flex-col items-center gap-3 md:py-0 py-6 md:border-l border-blue-700">
          <div className="flex justify-center items-center gap-2 w-full bg-blue-700 md:rounded-l-none rounded-md py-3">
            <IoIosLogIn className="md:text-2xl text-3xl text-white" />
            <p className="text-white text-xl font-semibold">
              Kwinjira muri konti
            </p>
          </div>

          <p className="text-lg md:px-20 p-2 md:text-center text-start">
            Kugirango ubone amakuru yawe ku bizamini ndetse na serivisi zitangwa
            na Heroes Technology. Ugomba kubanza kwinjira
          </p>

          <div className="flex flex-col items-start gap-4 md:w-[70%] w-full">
            <LoginInputs
              label="Telefone cg email"
              type="text"
              icon={<FaUser />}
              placeholder="07XXXXXXXX cg heroes@gmail.com fomate"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <LoginInputs
              label="Ijambo banga ukoresha"
              type="password"
              icon={<CiLock />}
              placeholder="Shyiramo ijambobanga"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="flex justify-center items-center gap-2 px-4 py-1 rounded-md bg-Total hover:bg-blue-800 text-white mt-4"
          >
            <FaCircleArrowRight className="text-white" />
            Saba Kwinjira
          </button>

          <div className="md:flex-row flex-col flex justify-center items-center md:gap-10 gap-4 md:mt-0 mt-4">
            <Link to="/hindura">
              <p className="flex justify-center items-center gap-2 text-blue-500 text-md hover:text-yellow-700">
                <FaQuestionCircle /> Wibagiwe Ijambobanga?
              </p>
            </Link>
            <p className="flex justify-center items-center gap-2 text-blue-500 text-md">
              Nta konti ufite?
              <Link
                to="/kwiyandikisha"
                className="text-xl text-blue-800 font-semibold ml-1 hover:text-yellow-700"
              >
                Yifungure
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
