'use client';
import { useState, useEffect } from "react";

function PendingTasksTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/bookings/fetchAllBookings");
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
      fetchTasks(); // Fetch tasks again after rescheduling
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (selectedTask && selectedEmployeeId) {
      const taskId = selectedTask.id;
      const employeeId = selectedEmployeeId;

      const response = await fetch("/api/tasks/assign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, employeeId }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error assigning task");
      }
      setShowAssignModal(false);
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="tasks-table">
      {tasks.length === 0 ? (
        <p>No pending tasks found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border">Task ID</th>
              <th className="border">Service Type</th>
              <th className="border">Vehicle Type</th>
              <th className="border">Date</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border">{task.id}</td>
                <td className="border">{task.serviceType}</td>
                <td className="border">{task.vehicleType}</td>
                <td className="border">{task.date}</td>
                <td className="border">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowRescheduleModal(true);
                    }}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowAssignModal(true);
                    }}
                    className="bg-green-500 text-white p-2 rounded ml-2"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
