import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUserData } from "../slice/authSlice";

const LoginPage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiConnector("POST", BASE_URL + "/api/v1/login", {
        email,
        password,
      });
      toast.success("Logged in successfully!");
      dispatch(setToken(response.data.token));
      dispatch(setUserData(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      toast.error("Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg mx-auto bg-white p-10 rounded-lg shadow-lg relative">
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-6">
          Taskie
        </h1>
        <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <Link to={"/register"} className="text-blue-500 hover:underline">
              Create Account
            </Link>
          </div>
        </form>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
            <div className="loader">
              <svg
                className="w-8 h-8 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
