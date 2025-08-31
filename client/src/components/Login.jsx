import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password, dispatch);
      if (response.status === 200) {
        toast.success("Login Success");
        navigate("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Welcome Back to Swoosh
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="mt-1 block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-[var(--primary-color)]/30 focus:border-[var(--primary-color)]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-blue-600 focus:ring-[var(--primary-color)]/30 border-gray-300 rounded focus:border-[var(--primary-color)]"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-[var(--primary-color)]">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 cursor-pointer bg-[var(--primary-color)] text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-[var(--primary-color)]/30 focus:ring-offset-1 focus:border-[var(--primary-color)] transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          onClick={() => navigate("/signup")}
          className="text-[var(--primary-color)] cursor-pointer font-medium"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
