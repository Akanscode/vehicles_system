'use client';
import { useEffect, useState, useCallback } from "react";
import RescheduleModal from "./RescheduleModal";

const PendingTasks = ({ userId, refreshTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasBookings, setHasBookings] = useState(null);

  const fetchPendingTasks = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true); // Set loading to true before making the API call

    try {
      // Fetch pending tasks
      const response = await fetch(`/api/bookings/fetchPendingTasks?userId=${userId}`);
      const data = await response.json();

      console.log("Fetched data:", data); // Debugging log

      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
        setHasBookings(true); // If tasks are found, set hasBookings to true
      } else {
        setTasks([]);
        setHasBookings(false); // If no tasks, set hasBookings to false
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setTasks([]); // In case of error, set tasks to an empty array
      setHasBookings(false); // Set hasBookings to false if there's an error
    } finally {
      setIsLoading(false); // Stop loading after fetch (success or failure)
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchPendingTasks(); // Fetch tasks when userId changes
  }, [fetchPendingTasks, userId]);

  useEffect(() => {
    if (refreshTasks) {
      fetchPendingTasks(); // Fetch tasks after refresh action
    }
  }, [refreshTasks]);

  const handleReschedule = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  // Check if we are still loading
  if (isLoading) return <p>Loading tasks...</p>; // Loading state message

  return (
    <div className="tasks grid gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-4 lg:max-w-screen-lg">
      {hasBookings === false ? (
        <p>No pending tasks found. Book a service to get started!</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-card rounded-[10px] w-auto shadow-md bg-white p-2 sm:p-4">
            <p className="mt-0.5 text-sm font-medium text-gray-900">Service: {task.serviceType}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">Vehicle: {task.vehicleType}</p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">Date: {task.date}</p>
            <p className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600">
              Status: {task.status}
            </p>
            <button
              className="group inline-block rounded-full mt-2 gradient-200 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
              onClick={() => handleReschedule(task.id)}
            >
              <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                Reschedule
              </span>
            </button>
          </div>
        ))
      )}
      {isModalOpen && (
        <RescheduleModal bookingId={selectedTaskId} onClose={closeModal} refreshTasks={fetchPendingTasks} />
      )}
    </div>
  );
};

export default PendingTasks;
