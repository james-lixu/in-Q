import React, { useState, useEffect } from "react";
import googleSignupButton from "../images/web_dark_rd_SU.svg";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
const inQLogo = require("../images/inQ-Logo.png");

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    window.history.pushState({}, '', `/${type}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    window.history.pushState({}, '', '/'); 
  };

  useEffect(() => {
    const handlePopState = () => {
      closeModal(); 
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <div className="flex items-center justify-center gap-16 p-8">
        <div>
          <img src={inQLogo} alt="in-Q Logo" className="w-48 h-auto" />
        </div>
        <div className="w-px h-32 bg-gray-500"></div>
        <div className="flex flex-col gap-4 items-center">
          <img src={googleSignupButton} alt="google sign up" className="w-40" />
          <div className="w-48 h-px bg-gray-500"></div>
          <button
            className="rounded-full p-2 text-sm bg-dark-gray hover:bg-slate-600"
            onClick={() => openModal('register')}
          >
            Sign up with E-mail
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <p className="text-center text-gray-500 text-sm mt-2">Already have an account?</p>
        <button 
          className="p-2 rounded-full pt-1.5 pb-1.5 text-sm bg-blue-gray hover:bg-blue-300" 
          onClick={() => openModal('login')}
        >
          Sign in
        </button>
      </div>
      <RegisterModal show={showModal && modalType === 'register'} onClose={closeModal} />
      <LoginModal show={showModal && modalType === 'login'} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;
