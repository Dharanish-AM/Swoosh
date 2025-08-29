import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try{
      const response = await signup(name, email, password);
      if (response.status === 201) {
        toast.success("Signup successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Signup failed");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Create a Swoosh Account</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="********"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[var(--primary-color)] text-white font-semibold rounded-lg shadow-md focus:outline-none  focus:ring-[var(--primary-color)]/30 focus:ring-offset-1 focus:border-[var(--primary-color)] transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a onClick={()=> navigate("/login")} className="text-[var(--primary-color)] cursor-pointer font-medium">
          Login
        </a>
      </p>
    </div>
  );
}