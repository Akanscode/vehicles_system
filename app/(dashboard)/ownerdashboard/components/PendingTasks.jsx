// PendingTasks Component
'use client';
import { useEffect, useState, useCallback } from 'react';
import RescheduleModal from './RescheduleModal';

const PendingTasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state to track fetch status
  const [hasBookings, setHasBookings] = useState(null); // Tracks if user has any bookings

  const fetchPendingTasks = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/fetchPendingTasks?userId=${userId}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
        setHasBookings(true);
      } else {
        setTasks([]);
        setHasBookings(false);
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setTasks([]);
      setHasBookings(false);
    } finally {
      setIsLoading(false); // Stop loading after fetch
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchPendingTasks();
    }
  }, [fetchPendingTasks, userId]);

  const handleReschedule = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="tasks grid gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-4 lg:max-w-screen-lg">
      {hasBookings === false ? (
        <p>No pending tasks found. Book a service to get started!</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task-card rounded-[10px] w-auto shadow-md bg-white p-2 sm:p-4">
            <p className='mt-0.5 text-sm font-medium text-gray-900'>Service: {task.serviceType}</p>
            <p className='mt-0.5 text-sm font-medium text-gray-900'>Vehicle: {task.vehicleType}</p>
            <p className='mt-0.5 text-sm font-medium text-gray-900'>Date: {task.date}</p>
            <p className='whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600'>Status: {task.status}</p>
            <button className='group inline-block rounded-full mt-2 gradient-200 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75'
            onClick={() => handleReschedule(task.id)}>
              <span className='block rounded-full bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent'>Reschedule</span>
            </button>
          </div>
        ))
      )}
      {isModalOpen && (
        <RescheduleModal
          bookingId={selectedTaskId}
          onClose={closeModal}
          refreshTasks={fetchPendingTasks}
        />
      )}
    </div>
  );
};

export default PendingTasks;
