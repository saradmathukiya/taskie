import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const LocationModule = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    capacity: "",
  });
  const [editLocation, setEditLocation] = useState(null);
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.auth);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/getLocation"
      );
      setLocations(response?.data);
    } catch (error) {
      toast.error("Failed to fetch locations");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        BASE_URL + "/api/v1/createLocation",
        newLocation
      );
      setLocations([...locations, response.data]);
      setNewLocation({ name: "", address: "", capacity: "" });
      toast.success("Location created successfully");
    } catch (error) {
      toast.error("Failed to create location");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiConnector("DELETE", BASE_URL + `/api/v1/deleteLocation/${id}`);
      setLocations(locations.filter((location) => location._id !== id));
      toast.success("Location deleted");
    } catch (error) {
      toast.error("Failed to delete location");
      console.error(error);
    }
  };

  const handleEdit = (location) => {
    setEditLocation(location);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "PUT",
        BASE_URL + "/api/v1/admin/updateLocation",
        {
          locationId: editLocation._id,
          name: editLocation.name,
          address: editLocation.address,
          capacity: editLocation.capacity,
        }
      );
      setLocations(
        locations.map((loc) =>
          loc._id === editLocation._id ? response.data : loc
        )
      );
      setEditLocation(null);
      toast.success("Location updated successfully");
    } catch (error) {
      toast.error("Failed to update location");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Locations</h1>
        <button
          onClick={() => navigate("/")}
          className=" text-blue-600  transition-colors duration-300"
        >
          ← Back to Home
        </button>
      </div>

      {(userData.role === "admin" ||
        userData.permissions.canCreateLocation) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg mb-8 border border-gray-200"
        >
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Add New Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Location name"
              value={newLocation.name}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newLocation.address}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newLocation.capacity}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            Create New Location
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-10 h-10 text-blue-500 animate-spin"
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left"> Address</th>
                <th className="p-4 text-left"> Capacity</th>

                {(userData.role === "admin" ||
                  userData.permissions.canUpdateLocation) && (
                  <th className="p-4 text-left"> Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr
                  key={location._id}
                  className="border-t hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="p-4 text-gray-600">{location.name}</td>
                  <td className="p-4 text-gray-600">{location.address}</td>
                  <td className="p-4 text-gray-600">{location.capacity}</td>
                  {(userData.role === "admin" ||
                    userData.permissions.canUpdateLocation) && (
                    <td className="p-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editLocation && (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-8 rounded-lg shadow-lg mt-8 border border-gray-200"
        >
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Edit Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Location name"
              value={editLocation.name}
              onChange={(e) =>
                setEditLocation({ ...editLocation, name: e.target.value })
              }
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={editLocation.address}
              onChange={(e) =>
                setEditLocation({ ...editLocation, address: e.target.value })
              }
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={editLocation.capacity}
              onChange={(e) =>
                setEditLocation({ ...editLocation, capacity: e.target.value })
              }
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            Update Location
          </button>
        </form>
      )}
    </div>
  );
};

export default LocationModule;
