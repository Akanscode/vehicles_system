// PendingTasksTable.jsx
'use client';
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

function PendingTasksTable() {
  const { user } = useAuth(); // Destructure `user` from AuthContext
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    if (user) {
      fetchTasks(user.uid); // Pass user ID to fetch tasks
    }
    fetchEmployees();
  }, [user]);

  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`/api/bookings/fetchPendingTasks?userId=${userId}`);
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []); // Ensure `tasks` is an array
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Set `tasks` to an empty array in case of error
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (selectedTask) {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTask),
      });
      setShowRescheduleModal(false);
      fetchTasks(user.uid); // Fetch tasks again after rescheduling
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (selectedTask && selectedEmployeeId) {
      const taskId = selectedTask.id;
      const employeeId = selectedEmployeeId;
      const taskDescription = selectedTask.description;

      const response = await fetch("/api/tasks/assign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, employeeId, taskDescription }),
      });

      if (response.ok) {
        setShowAssignModal(false);
        fetchTasks(user.uid); // Fetch tasks again after assignment
      } else {
        console.error("Failed to assign task");
      }
    }
  };

  const openRescheduleModal = (task) => {
    setSelectedTask(task);
    setShowRescheduleModal(true);
  };

  const openAssignModal = (task) => {
    setSelectedTask(task);
    setShowAssignModal(true);
  };

  const renderTable = () => (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <h4>Pending Tasks</h4>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-[0.50rem] text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-4 border-b">Task ID</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Assigned Workshop</th>
                  <th className="py-2 px-4 border-b">Due Date</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b dark:border-gray-700 text-[0.50rem]">
                    <td className="py-2 px-4 border-b ">{task.id}</td>
                    <td className="py-2 px-4 border-b ">{task.serviceType}</td>
                    <td className="py-2 px-4 border-b ">{task.assignedEmployee || 'Unassigned'}</td>
                    <td className="py-2 px-4 border-b ">{task.date}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button
                        onClick={() => openRescheduleModal(task)}
                        className="text-blue-600 hover:underline"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => openAssignModal(task)}
                        className="text-green-600 hover:underline"
                      >
                        Assign Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-auto rounded-lg shadow-lg">
      {loading ? <p>Loading...</p> : renderTable()}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Reschedule Task</h2>
            <form onSubmit={handleReschedule}>
              {/* Reschedule form fields */}
            </form>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Assign Task</h2>
            <form onSubmit={handleAssignTask}>
              {/* Assign form fields */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingTasksTable;
