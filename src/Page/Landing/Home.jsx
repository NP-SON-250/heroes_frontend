import React from "react";
import Homes from "../../assets/home.jpg";
import Young from "../../assets/young.jpg";
import { FaArrowRight } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { HiHome } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="grid md:grid-cols-1 justify-center items-center pt-16">
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="">
          <img src={Homes} alt="" className="md:h-[50vh] md:w-[90%]" />
        </div>
        <div className="flex flex-col justify-start items-center px-5 py-5 md:-ml-12">
          <h1 className="md:text-2xl uppercase flex gap-1 font-semibold pb-2 text-center">
            Ukeneye Gutsindira
            <span className="text-Passed">Provisoir</span> ?
          </h1>
          <div className="flex items-center w-full justify-center gap-4">
            <div className="w-20 h-[2px] bg-Total md:w-[30%] mt-2"></div>

            <h3 className="md:text-2xl text-Unpaid font-bold">Twagufasha</h3>

            <div className="w-20 h-[2px] bg-Total md:w-[30%] mt-2"></div>
          </div>
          <div>
            <p className="text-start md:text-md text-md text-Total py-4 px-0">
              Uhereye uyuminsi iyandikishe kuri sisteme yacu, maze wisanzure
              n'ibisubizo bigezweho Heroes Technology yabazaniye; Aho ushobora
              kwimenyereza gugukora ibizamini bya provisoir Online, ndetse no
              kwiga ukoresheje ibizamini bisubije neza!
            </p>
            <div className="md:absolute md:w-[50%] w-full md:justify-normal flex justify-center  md:left-[470px] md:top-[290px]">
              <div className="flex justify-center md:w-[35%] w-[70%] text-md font-bold text-Total items-center gap-4 md:px-1 py-2 bg-Unpaid hover:bg-yellow-800 rounded-full">
                <Link to={"/kwiyandikisha"}>
                  <button>Tangira Uyumunsi</button>
                </Link>
                <div className="w-6 rounded-full bg-white h-6 flex justify-center items-center p-2">
                  <FaArrowRight className="text-Total" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1">
        <div className=" flex flex-col justify-center ">
          <div className="flex flex-col py-10">
            <p className="text-Total text-start md:px-48 px-5 py-2">
              Ubu nawe wakoresha igihe cyawe neza! Hamwe na Heroes Technology,
              wakwiga amategeko y'umuhanda wifashishije uburyo bugezweho bwo
              kwimenyereza gugukora ikizamini cya provisoir aribwo Online
              wibereye iwawe.
            </p>
            <div className="w-[80%] h-[2px] bg-Passed md:w-[66%] md:mx-48 mx-5  mt-2"></div>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-1 justify-center md:py-0 py-4 md:px-32">
            <div className="flex justify-start md:px-2 px-5 items-center text-start gap-2 ">
              <LuPhoneCall className="text-Total text-2xl font-semibold" />
              <p className="text-center text-lg text-Total">
                +250 789 394 424 | 792 337 053
              </p>
            </div>
            <div className="flex justify-start md:px-0 px-5 items-center gap-4">
              <MdEmail className="text-Total text-2xl font-semibold" />
              <p className="text-center text-lg text-Total underline">
                herostechnology.ltd@gmail.com
              </p>
            </div>
            <div className="flex justify-start md:px-0 px-5 items-center gap-4">
              <HiHome className="text-Total text-2xl font-semibold" />
              <p className="text-center text-lg text-Total">Huye, Butare</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
