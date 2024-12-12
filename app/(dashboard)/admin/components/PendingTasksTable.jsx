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
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/bookings/fetchAllBookings");
      const data = await response.json();
      const updatedTasks = data.map((task) => ({
        ...task,
        isOverdue: new Date(task.date) < new Date(), // Mark overdue tasks
      }));
      setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
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
    if (selectedTask && newDate) {
      const updatedTask = { ...selectedTask, date: newDate };
      try {
        await fetch("/api/bookings/reschedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
        setShowRescheduleModal(false);
        fetchTasks();
      } catch (error) {
        console.error("Error rescheduling task:", error);
      }
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (selectedTask) {
      const updatedTask = { ...selectedTask };

      // Check if the task already has an assigned employee
      if (selectedTask.assignedEmployeeId) {
        // If assigned, unassign by removing the employee
        updatedTask.assignedEmployeeId = null;
        updatedTask.assignedEmployeeName = null;
      } else {
        // If unassigned, assign the selected employee
        updatedTask.assignedEmployeeId = selectedEmployeeId;
        const selectedEmployee = employees.find(
          (employee) => employee.id === selectedEmployeeId
        );
        updatedTask.assignedEmployeeName = selectedEmployee
          ? selectedEmployee.name
          : null;
      }

      try {
        await fetch("/api/bookings/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
        setShowAssignModal(false);
        fetchTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleTaskCompletion = (task) => {
    if (task.isOverdue && task.status !== "Completed") {
      task.status = "Pending";
    } else if (task.status === "Completed") {
      moveToServiceHistory(task);
    }
    fetchTasks();
  };

  const moveToServiceHistory = async (task) => {
    try {
      await fetch("/api/serviceHistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      await fetch(`/api/bookings/${task.id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error moving to service history:", error);
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
              <th className="border">Assigned Employee</th>
              <th className="border">Status</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={task.isOverdue ? "bg-red-100" : ""}>
                <td className="border">{task.id}</td>
                <td className="border">{task.serviceType}</td>
                <td className="border">{task.vehicleType}</td>
                <td className="border">{task.date}</td>
                <td className="border">{task.assignedEmployeeName || "Unassigned"}</td>
                <td className="border">{task.status}</td>
                <td className="border flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowRescheduleModal(true);
                    }}
                    className="bg-blue-500 text-white p-2 text-[0.56rem] rounded"
                    disabled={task.isOverdue}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowAssignModal(true);
                    }}
                    className="bg-green-500 text-white p-2 text-[0.56rem] rounded ml-2"
                  >
                    {task.assignedEmployeeId ? "Unassign" : "Assign"}
                  </button>
                  <button
                    onClick={() => handleTaskCompletion(task)}
                    className="bg-gray-500 text-white p-2 text-[0.56rem] rounded ml-2"
                  >
                    Mark Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Reschedule Task</h2>
            <form onSubmit={handleReschedule}>
              <label className="block mb-2">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="border rounded w-full p-2"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
              >
                Reschedule Task
              </button>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Assign Task</h2>
            <form onSubmit={handleAssignTask}>
              <label className="block mb-2">Select Employee</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="border rounded w-full p-2"
                required
              >
                <option value="">Select</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
              >
                {selectedTask?.assignedEmployeeId ? "Unassign Task" : "Assign Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingTasksTable;
