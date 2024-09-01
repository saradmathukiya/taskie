import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

// Sample Data
const moduleData = [
  { name: "Tasks", icon: "📝", path: "/tasks", color: "bg-blue-500" },
  { name: "Locations", icon: "📍", path: "/locations", color: "bg-green-500" },
];

const updates = [
  {
    id: 1,
    title: "System Maintenance",
    date: "2024-08-28",
    description:
      "Scheduled system maintenance on August 30th from 2 AM to 4 AM.",
  },
  {
    id: 2,
    title: "New Feature Release",
    date: "2024-08-25",
    description:
      "We are excited to announce the release of our new reporting feature!",
  },
];

const Dashboard = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [tasksCount, setTasksCount] = useState(0);
  const [locationsCount, setLocationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyUpdates, setCompanyUpdates] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasksCount();
    fetchLocationsCount();
    fetchCompanyUpdates();
  }, []);

  const fetchTasksCount = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", BASE_URL + "/api/v1/getTask");
      setTasksCount(response?.data?.length || 0);
    } catch (error) {
      console.error("Failed to fetch tasks count", error);
    }
    setLoading(false);
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
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/getLocation"
      );
      setLocationsCount(response?.data?.length || 0);
    } catch (error) {
      console.error("Failed to fetch locations count", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Welcome to Taskie, John Doe!
      </h1>

      <div className="flex justify-center mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Task and Location Visualization */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="flex justify-around w-full">
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">
                {loading ? "Loading..." : tasksCount}
              </h3>
              <p className="text-lg text-gray-600">Tasks</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">
                {loading ? "Loading..." : locationsCount}
              </h3>
              <p className="text-lg text-gray-600">Locations</p>
            </div>
          </div>
        </div>

        {/* Company Updates and Announcements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Company Updates</h2>
          <ul>
            {companyUpdates?.map((update) => (
              <li key={update.id} className="mb-4">
                <h3 className="text-lg font-semibold">{update.title}</h3>
                <p>{update.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
