import React from "react";

const RegistrationForm = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
