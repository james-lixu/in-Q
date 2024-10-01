import React, { useState } from "react";
import axios from 'axios';

const inQLogo = require("../images/inQ-Logo.png");

const FloatingLabelInput = ({ label, type, name, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    if (!e.target.value) {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-3/4 mb-4">
      <label
        className={`absolute left-4 top-5 text-slate-400 transition-all duration-300 transform
        ${isFocused || value ? "text-sm -translate-y-9" : "text-base"}`}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        className={`w-full p-2 border rounded-xl bg-slate-800 text-slate-100 indent-1 
          ${
            error
              ? "border-neon-red"
              : value
              ? "border-neon-green"
              : "border-slate-400"
          }
          focus:border-slate-500 focus:border-2 focus:outline-none m-2`}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errorMessage, setErrorMessage] = useState(""); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrorMessage("");

    if (name === "email") {
      setFormErrors((prevState) => ({
        ...prevState,
        email: !validateEmail(value),
      }));
    } else if (name === "username") {
      setFormErrors((prevState) => ({
        ...prevState,
        username: !validateUsername(value),
      }));
    } else if (name === "password") {
      setFormErrors((prevState) => ({
        ...prevState,
        password: !validatePassword(value),
      }));
    } else if (name === "confirmPassword") {
      setFormErrors((prevState) => ({
        ...prevState,
        confirmPassword: value !== formData.password,
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 4;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid =
      !Object.values(formErrors).includes(true) &&
      validateEmail(formData.email) &&
      validateUsername(formData.username) &&
      validatePassword(formData.password) &&
      formData.password === formData.confirmPassword;

    if (!isFormValid) {
      const messages = [];
      if (formErrors.username) messages.push("Username must be at least 4 characters.");
      if (formErrors.email) messages.push("Email is not valid.");
      if (formErrors.password) messages.push("Password must be at least 6 characters.");
      if (formErrors.confirmPassword) messages.push("Passwords do not match.");
      setErrorMessage(messages.join(" "));
      return;
    }
  try {
    const response = await axios.post('http://localhost:4000/api/users/register', formData);
    console.log(response.data.message); // You can display a success message here
  } catch (error) {
    setErrorMessage(error.response.data.error);
  }

    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center flex-col items-center">
          <img src={inQLogo} alt="in-Q Logo" className="w-36 mb-4" />
          <h2 className="text-2xl mb-8">Create your account.</h2>

          {/* Error message display */}
          {errorMessage && (
            <div className="text-neon-red mb-4 text-center">{errorMessage}</div>
          )}

          <FloatingLabelInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={formErrors.username}
          />
          <FloatingLabelInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
          />
          <FloatingLabelInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
          />
          <FloatingLabelInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
          />

          <button
            type="submit"
            className="w-1/4 bg-blue-gray text-white py-2 rounded transform transition-transform duration-300 hover:scale-105 hover:shadow-lg active:animate-bounce hover:bg-blue-300"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;