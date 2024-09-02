import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const TaskModule = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "pending",
    due_date: "",
  });
  const [editTask, setEditTask] = useState(null); // State to handle task editing
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.auth);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", BASE_URL + "/api/v1/getTask");
      setTasks(response?.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        BASE_URL + "/api/v1/createTask",
        newTask
      );
      setTasks([...tasks, response.data]);
      setNewTask({ name: "", status: "pending", due_date: "" });
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiConnector("DELETE", BASE_URL + `/api/v1/deleteTask/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "PUT",
        BASE_URL + `/api/v1/admin/updateTask`,
        {
          taskId: editTask._id,
          name: editTask.name,
          status: editTask.status,
          due_date: editTask.due_date,
        }
      );
      setTasks(
        tasks.map((task) => (task._id === editTask._id ? response.data : task))
      );
      setEditTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">Tasks</h1>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors duration-300"
        >
          ← Back to Home
        </button>
      </div>

      {(userData.role === "admin" || userData.permissions.canCreateTask) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Task name"
              value={newTask.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="date"
              name="due_date"
              value={newTask.due_date}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            Create Task
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-8 h-8 text-blue-500 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#1C64F2"
            />
          </svg>
        </div>
      ) : (
        <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Due Date</th>
              {(userData.role === "admin" ||
                userData.permissions.canCreateTask) && (
                <th className="p-4 text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b">
                <td className="p-4">{task.name}</td>
                <td className="p-4 capitalize">{task.status}</td>
                <td className="p-4">
                  {new Date(task.due_date).toLocaleDateString()}
                </td>
                {(userData.role === "admin" ||
                  userData.permissions.canCreateTask) && (
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editTask && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={editTask.name}
                  onChange={(e) =>
                    setEditTask({ ...editTask, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={editTask.due_date}
                  onChange={(e) =>
                    setEditTask({ ...editTask, due_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
              >
                Update Task
              </button>
              <button
                type="button"
                onClick={() => setEditTask(null)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 mt-4 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskModule;
