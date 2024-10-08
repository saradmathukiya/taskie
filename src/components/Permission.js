import React, { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Permission = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [companyUpdates, setCompanyUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/admin/users",
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setUsers(response?.data);
    } catch (error) {
      toast.error("Failed to fetch Users");
      console.error(error);
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

  const updateUserPermissions = async () => {
    if (!selectedUser) return;

    try {
      await apiConnector(
        "PUT",
        BASE_URL + "/api/v1/admin/updatePermissions",
        {
          userId: selectedUser._id,
          canCreateLocation: selectedUser.permissions.canCreateLocation,
          canCreateTask: selectedUser.permissions.canCreateTask,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Permissions updated successfully");
      fetchUsers();
      setSelectedUser(null); // Close the modal after update
    } catch (error) {
      toast.error("Failed to update permissions");
      console.error("Failed to update permissions:", error);
    }
  };

  const handlePermissionChange = (permissionKey) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      permissions: {
        ...prevUser.permissions,
        [permissionKey]: !prevUser.permissions[permissionKey],
      },
    }));
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.title.trim() || !newUpdate.description.trim()) {
      toast.error("Both title and description are required");
      return;
    }

    try {
      await apiConnector("POST", `${BASE_URL}/api/v1/addUpdate`, newUpdate, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Company update added successfully");
      setNewUpdate({ title: "", description: "" });
      fetchCompanyUpdates(); // Refresh the updates list
    } catch (error) {
      toast.error("Failed to add update");
      console.error("Error adding update:", error);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    try {
      await apiConnector(
        "DELETE",
        `${BASE_URL}/api/v1/deleteUpdate/${updateId}`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Update deleted successfully");
      fetchCompanyUpdates(); // Refresh the updates list
    } catch (error) {
      toast.error("Failed to delete update");
      console.error("Error deleting update:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanyUpdates();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
        >
          ← Back to Home
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
            Loading...
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Permissions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <span>
                          Create Location:{" "}
                          {user.permissions.canCreateLocation ? "Yes" : "No"}
                        </span>
                        <span>
                          Create Task:{" "}
                          {user.permissions.canCreateTask ? "Yes" : "No"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          // Open a modal or form to update permissions
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Update Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Company Updates Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Company Updates</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newUpdate.title}
            onChange={(e) =>
              setNewUpdate({ ...newUpdate, title: e.target.value })
            }
            placeholder="Update Title"
            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
          />
          <textarea
            value={newUpdate.description}
            onChange={(e) =>
              setNewUpdate({ ...newUpdate, description: e.target.value })
            }
            placeholder="Update Description"
            className="p-2 border border-gray-300 rounded-md mb-2 w-full"
          />
          <button
            onClick={handleAddUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Update
          </button>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companyUpdates.map((update) => (
                <tr key={update._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {update.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {update.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUpdate(update._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update User Permissions Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Update Permissions for {selectedUser.username}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Create Location
              </label>
              <input
                type="checkbox"
                checked={selectedUser.permissions.canCreateLocation}
                onChange={() => handlePermissionChange("canCreateLocation")}
                className="ml-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Create Task
              </label>
              <input
                type="checkbox"
                checked={selectedUser.permissions.canCreateTask}
                onChange={() => handlePermissionChange("canCreateTask")}
                className="ml-2"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={updateUserPermissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permission;
