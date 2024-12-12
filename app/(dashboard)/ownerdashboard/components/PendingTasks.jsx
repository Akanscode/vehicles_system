'use client';
import { useEffect, useState, useCallback } from "react";
import RescheduleModal from "./RescheduleModal";

const PendingTasks = ({ uid }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPendingTasks = useCallback(async () => {
    if (!uid) return; // Prevent fetching if userDocId is not available
    try {
      const response = await fetch(`/api/bookings/fetchPendingTasks?uid=${uid}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
    }
  }, [uid]);

  useEffect(() => {
    fetchPendingTasks();
  }, [fetchPendingTasks]);

  const handleReschedule = (taskId) => {
    setSelectedTaskId(taskId);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="tasks grid gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-4 lg:max-w-screen-lg">
      {tasks.length === 0 ? (
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
      {modalOpen && (
        <RescheduleModal
          bookingId={selectedTaskId}
          onClose={handleModalClose}
          refreshTasks={fetchPendingTasks}
        />
      )}
    </div>
  );
};

export default PendingTasks;
