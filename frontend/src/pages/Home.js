import React, { useState } from "react";
import googleSignupButton from "../images/web_dark_rd_SU.svg";
import RegisterModal from "../components/RegisterModal";
const inQLogo = require("../images/inQ-Logo.png");

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      {/* Main Section */}
      <div className="flex items-center justify-center gap-16 p-8">
        {/* Logo Section */}
        <div>
          <img src={inQLogo} alt="in-Q Logo" className="w-48 h-auto" />
        </div>

        {/* Divider Line */}
        <div className="w-px h-32 bg-gray-500"></div>

        {/* Sign-up Buttons Section */}
        <div className="flex flex-col gap-4 items-center">
          <img src={googleSignupButton} alt="google sign up" className="w-40" />
          <div className="w-48 h-px bg-gray-500"></div>
          <button
            className="rounded-full p-2 text-sm bg-dark-gray hover:bg-slate-600"
            onClick={openModal}
          >
            Sign up with E-mail
          </button>
        </div>
      </div>

      {/* Text Below the Main Section */}
      <div className="mt-4 flex gap-4">
        <p className="text-center text-gray-500 text-sm mt-2">
          Already have an account?
        </p>
        <button className="p-2 rounded-full pt-1.5 pb-1.5 text-sm bg-blue-gray hover:bg-blue-300">
          Sign in
        </button>
      </div>
      {/* Register Modal */}
      <RegisterModal show={showModal} onClose={closeModal}></RegisterModal>
    </div>
  );
};

export default Home;
