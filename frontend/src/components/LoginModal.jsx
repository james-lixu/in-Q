import React from "react";
import LoginForm from "../forms/LoginForm";

const LoginModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 z-50 backdrop-blur-xl">
      <div className="bg-background rounded-lg shadow-lg w-1/2 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
        <LoginForm/>
      </div>
    </div>
  );
};

export default LoginModal;
