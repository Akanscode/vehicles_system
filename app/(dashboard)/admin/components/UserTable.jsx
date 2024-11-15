'use client';
import { useEffect, useState } from 'react';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/fetchUsers', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched users:", data); // Check if vehicle owners are received
        
        // Ensure data.users is an array before setting it
        if (Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setError('Unexpected data format received.');
          setUsers([]); // Set to empty array to avoid filter issues
        }
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError('Error deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users based on search input
  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <h2 className="text-xl font-bold mb-4"> registered Vehicle Owners</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between p-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border text-sm rounded-lg w-full p-2 pl-10"
              />
            </div>
            <button className="text-white bg-green-700 px-4 py-2 rounded-lg">
              Filter
            </button>
          </div>

          <table className="w-full text-xs text-left  text-gray-500 dark:text-gray-400">
            <thead className=" text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700">
              <tr className='text-[0.50rem]'>
                <th className="py-2 px-4 border-b">First </th>
                <th className="py-2 px-4 border-b">Last </th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Vehicle </th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700 text-[0.50rem] ">
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.vehicleType}</td>
                    <td>{user.role}</td>
                    
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
