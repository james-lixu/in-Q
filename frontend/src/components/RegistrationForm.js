import React from "react";

const RegistrationForm = () => {
  return (
    <form className="flex flex-col items-center gap-4 mt-4">
      <input
        type="text"
        placeholder="Email"
        className="border p-2 rounded-lg w-64"
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded-lg w-64"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-lg w-64"
      >
        Submit
      </button>
    </form>
  );
};

export default RegistrationForm;
