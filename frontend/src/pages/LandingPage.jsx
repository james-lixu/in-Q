import React, { useState, useEffect } from "react";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
const inQLogo = require("../images/inQ-Logo.png");

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    window.history.pushState({}, "", `/${type}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    window.history.pushState({}, "", "/");
  };

  useEffect(() => {
    const handlePopState = () => {
      closeModal();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <div className="flex items-center justify-center gap-16">
        {/* Logo*/}
        <div className="flex flex-col items-center justify-center">
          <img src={inQLogo} alt="in-Q Logo" className="w-96 h-auto" />
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-32 bg-gray-500"></div>

        {/* Sign up */}
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">Find Your Queue.</h1>
          <div className="w-64 h-px bg-gray-500"></div>
          <button
            className="rounded-full pt-2 pb-2 pl-10 pr-10 text-sm bg-slate-600 hover:bg-secondary"
            onClick={() => openModal("register")}
          >
            Sign up with E-mail
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-row items-center gap-2">
        <p className="text-center text-gray-500 text-sm">Already have an account?</p>
        <button
          className="p-2 rounded-full pt-1.5 pb-1.5 pl-6 pr-6 text-sm bg-slate-600 hover:bg-primary"
          onClick={() => openModal("login")}
        >
          Sign in
        </button>
      </div>

      {/* Modals */}
      <RegisterModal show={showModal && modalType === "register"} onClose={closeModal} />
      <LoginModal show={showModal && modalType === "login"} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;
