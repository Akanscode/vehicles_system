'use client';
import { useState, useEffect } from "react";

function VehicleOwnersTable() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch("/api/users/fetchUsers");
      const data = await response.json();
      
      // Check if the data is an array before setting it
      setOwners(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching owners:", error);
      setOwners([]);  // Set an empty array on error
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchOwners();
  };

  const renderTable = () => (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-50 border text-sm rounded-lg w-full p-2 pl-10"
              />
            </div>
            <button className="text-white bg-green-700 px-4 py-2 rounded-lg">
              Filter
            </button>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b">Owner Name</th>
                <th className="py-2 px-4 border-b">Vehicle Details</th>
                <th className="py-2 px-4 border-b">Contact Info</th>
                <th className="py-2 px-4 border-b">Last Service Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td className="py-2 px-4 border-b">{owner.name}</td>
                  <td className="py-2 px-4 border-b">{owner.vehicleDetails}</td>
                  <td className="py-2 px-4 border-b">{owner.contactInfo}</td>
                  <td className="py-2 px-4 border-b">{owner.lastServiceDate}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDelete(owner.id)}
                      className="text-red-600 hover:underline"
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
    </div>
  );

  return (
    <div className="overflow-auto rounded-lg shadow-lg">
      {loading ? <p>Loading...</p> : renderTable()}
    </div>
  );
}

export default VehicleOwnersTable;
