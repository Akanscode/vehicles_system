'use client';

import { useEffect, useState } from 'react';

export default function EmployeeManagementTable() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [employee, setEmployee] = useState({ name: '', position: '', department: '', email: ''});
  const [error, setError] = useState(null); // State to hold error messages
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch employees from API on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await fetch('/api/employees');

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('Error fetching employees:', errorMessage);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError('Failed to fetch employees. Please try again later.'); // User-friendly error message
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchEmployees();
  }, []);

  // Open modal and reset form for new employee
  const openAddEmployeeModal = () => {
    setEmployee({ name: '', position: '', department: '', email: '' });
    setEditingIndex(-1);
    setShowModal(true);
  };

  // Save employee to list
  const saveEmployee = async (e) => {
    e.preventDefault();
    const method = editingIndex >= 0 ? 'PUT' : 'POST';
    const url = editingIndex >= 0 ? `/api/employees/${employees[editingIndex].id}` : '/api/employees';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error saving employee:', errorMessage);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedEmployee = await response.json();
      const updatedEmployees = [...employees];

      if (editingIndex >= 0) {
        updatedEmployees[editingIndex] = updatedEmployee; // Update existing employee
      } else {
        updatedEmployees.push(updatedEmployee); // Add new employee
      }

      setEmployees(updatedEmployees);
      setShowModal(false);
    } catch (err) {
      setError('Failed to save employee. Please try again.'); // User-friendly error message
    }
  };

  // Delete employee
  const deleteEmployee = async (index) => {
    const employeeToDelete = employees[index];

    try {
      const response = await fetch(`/api/employees/${employeeToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error deleting employee:', errorMessage);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
    } catch (err) {
      setError('Failed to delete employee. Please try again.'); // User-friendly error message
    }
  };

  // Open modal with existing employee data
  const editEmployee = (index) => {
    setEditingIndex(index);
    setEmployee(employees[index]);
    setShowModal(true);
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.position?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.department?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gray-50  p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        {error && <p className="text-red-600">{error}</p>} {/* Display error message if any */}
        {loading ? (
          <p>Loading...</p> // Display loading message while fetching
        ) : (
          <div className="bg-white  shadow-md sm:rounded-lg overflow-hidden">
            {/* Search and Add Employee */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4">
              <form className="flex w-full md:w-1/2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="bg-gray-50 border text-sm rounded-lg p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <button
                onClick={openAddEmployeeModal}
                className="bg-green-700 text-white rounded-lg px-4 py-2 dark:bg-primary-600"
              >
                Add Employee
              </button>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr key={emp.id} className="border-b dark:border-gray-700 text-xs">
                      <td className="px-4 py-3">{emp.name}</td>
                      <td className="px-4 py-3">{emp.position}</td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3">{emp.email}</td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button onClick={() => editEmployee(index)} className="text-blue-600 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => deleteEmployee(index)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">{editingIndex >= 0 ? 'Edit Employee' : 'Add Employee'}</h2>
              <form onSubmit={saveEmployee}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Name</label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={employee.name}
                    onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Position</label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={employee.position}
                    onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Department</label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={employee.department}
                    onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-700 dark:text-gray-200">Email</label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={employee.email}
                    onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="button" className="mr-2 text-gray-500" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
