import React from "react";
import {
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TaskModule from "./components/TaskModule";
import LocationModule from "./components/LocationModule";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SingnupPage";
import OpenRoute from "./components/OpenRoute";
import Permission from "./components/Permission";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserData } from "./slice/authSlice";
import toast from "react-hot-toast";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, userData } = useSelector((state) => state.auth);

  // Check if the current route is the login or signup page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage && (
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and title */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    Taskie
                  </span>
                </Link>
              </div>

              {/* User actions */}
              <div className="flex items-center space-x-4">
                {userData?.role === "admin" && (
                  <button
                    className="relative flex items-center px-2 py-1 overflow-hidden font-medium transition-all bg-blue-600 rounded-md group sm:px-2 sm:py-2"
                    onClick={() => navigate("/permission")}
                  >
                    <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-600 rounded group-hover:-mr-4 group-hover:-mt-4">
                      <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                    </span>
                    <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-600 rounded group-hover:-ml-4 group-hover:-mb-4">
                      <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-green-500 rounded-md group-hover:translate-x-0"></span>
                    <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white text-sm">
                      Permissions
                    </span>
                  </button>
                )}
                {token && (
                  <button
                    className="cursor-pointer transition-all bg-blue-600 text-white px-4 py-1 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={() => {
                      localStorage.removeItem("token");
                      dispatch(setToken(null));
                      dispatch(setUserData(null));
                      navigate("/login");
                      toast.success("Logout successful!!!");
                    }}
                  >
                    Logout
                  </button>
                )}

                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">User menu</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  {/* Hide username in mobile view */}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userData?.username}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <OpenRoute>
                <Dashboard />
              </OpenRoute>
            }
          />
          <Route path="/tasks" element={<TaskModule />} />
          <Route path="/locations" element={<LocationModule />} />
          <Route path="/permission" element={<Permission />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
