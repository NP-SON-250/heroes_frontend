import React from "react";

const LandingFooter = () => {
  // Function to get the current year
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <>
      <div className="md:hidden block  flex-col max-h[20vh] w-full justify-center bg-Unpaid ">
        <div>
          <p
            className="p-3 text-blue-900 md:text-2xl text-sm font-bold text-center 
            uppercase"
          >
            &copy; {getCurrentYear()}
            Congozi Expert Technical Unity{" "}
            <span className=" normal-case">Limited</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LandingFooter;
