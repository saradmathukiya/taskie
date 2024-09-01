import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const [tasksCount] = useState(3); // Example task count
  const [locationsCount] = useState(3); // Example location count
  const navigate = useNavigate();

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
              <h3 className="text-4xl font-bold mb-2">{tasksCount}</h3>
              <p className="text-lg text-gray-600">Tasks</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold mb-2">{locationsCount}</h3>
              <p className="text-lg text-gray-600">Locations</p>
            </div>
          </div>
        </div>

        {/* Company Updates and Announcements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Company Updates</h2>
          <ul>
            {updates.map((update) => (
              <li key={update.id} className="mb-4">
                <h3 className="text-lg font-semibold">{update.title}</h3>
                <p className="text-gray-600">{update.date}</p>
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
