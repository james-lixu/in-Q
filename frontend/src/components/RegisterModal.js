import React from "react";
import RegistrationForm from "./RegistrationForm";

const RegisterModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-primary rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
        <RegistrationForm/>
      </div>
    </div>
  );
};

export default RegisterModal;
