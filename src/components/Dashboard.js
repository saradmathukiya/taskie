import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

// Sample Data
const moduleData = [
  { name: "Tasks", icon: "📝", path: "/tasks", color: "bg-blue-500" },
  { name: "Locations", icon: "📍", path: "/locations", color: "bg-green-500" },
];

const Dashboard = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [tasksCount, setTasksCount] = useState(0);
  const [locationsCount, setLocationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyUpdates, setCompanyUpdates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTasksCount(),
        fetchLocationsCount(),
        fetchCompanyUpdates(),
      ]);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksCount = async () => {
    try {
      const response = await apiConnector("GET", BASE_URL + "/api/v1/getTask");
      setTasksCount(response?.data?.length || 0);
      const pendingTasks = response?.data.filter(
        (task) => task.status === "pending"
      );
      setTasks(pendingTasks);
    } catch (error) {
      console.error("Failed to fetch tasks count", error);
    }
  };

  const fetchCompanyUpdates = async () => {
    try {
      const response = await apiConnector("GET", BASE_URL + "/api/v1/updates");
      setCompanyUpdates(response.data);
    } catch (error) {
      toast.error("Failed to fetch company updates");
      console.error("Error fetching updates:", error);
    }
  };

  const fetchLocationsCount = async () => {
    try {
      const response = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/getLocation"
      );
      setLocationsCount(response?.data?.length || 0);
    } catch (error) {
      console.error("Failed to fetch locations count", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Welcome to Taskie
      </h1>

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <svg
            className="w-16 h-16 text-blue-500 animate-spin"
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
      )}

      {!loading && (
        <>
          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              {moduleData.map((module) => (
                <Link
                  key={module.name}
                  to={module.path}
                  className={`${module.color} hover:opacity-90 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-5xl mb-3">{module.icon}</span>
                  <span className="text-2xl font-semibold">{module.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Task and Location Visualization */}
            <div className="p-6 rounded-lg shadow-xl flex flex-col items-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Overview
              </h2>
              <div className="flex justify-around w-full">
                <div className="text-center">
                  <h3 className="text-6xl font-extrabold text-blue-600 mb-2">
                    {tasksCount}
                  </h3>
                  <p className="text-lg font-medium text-blue-700">Tasks</p>
                </div>
                <div className="text-center">
                  <h3 className="text-6xl font-extrabold text-green-600 mb-2">
                    {locationsCount}
                  </h3>
                  <p className="text-lg font-medium text-green-600">
                    Locations
                  </p>
                </div>
              </div>
            </div>

            {/* Company Updates and Announcements */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Company Updates
              </h2>
              <ul className="space-y-4">
                {companyUpdates.map((update) => (
                  <li
                    key={update.id}
                    className="border-b border-gray-300 pb-4 last:border-none"
                  >
                    <h3 className="text-xl font-semibold text-gray-700">
                      {update.title}
                    </h3>
                    <p className="text-gray-600">{update.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(update.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reminder Section */}
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Your Reminders
            </h2>
            <ul className="list-none space-y-4">
              {tasks.map((task) => (
                <li key={task._id}>
                  <Link
                    to="/tasks"
                    className="text-lg font-medium text-yellow-700 hover:text-yellow-900 transition-colors duration-200"
                  >
                    {task.name} - Due by{" "}
                    {new Date(task.due_date).toLocaleDateString()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
