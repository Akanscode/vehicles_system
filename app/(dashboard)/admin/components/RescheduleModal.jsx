'use client';
import React, { useState } from 'react';
import { showToast } from '@/app/components/toast';

const RescheduleModal = ({ onClose, taskId, refreshTasks }) => {
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!newDate) {
        throw new Error('Please select a new date.');
      }

      const response = await fetch(`/api/bookings/rescheduleBooking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          newDate,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to reschedule booking.');
      }

      showToast('Booking rescheduled successfully!');
      refreshTasks();
      onClose();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      setError(error.message || 'Error rescheduling booking.');
      showToast(error.message || 'Error rescheduling booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Reschedule Booking</h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <p>Updating...</p>
            ) : (
              <form onSubmit={handleReschedule}>
                {error && <p className="text-red-600">{error}</p>}
                <label htmlFor="newDate" className="block mt-4">
                  Select New Date:
                </label>
                <input
                  type="date"
                  id="newDate"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="block w-full mt-1 p-2 border rounded"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full gradient-200 text-white py-2 rounded hover:gradient-100"
                >
                  {loading ? 'Rescheduling...' : 'Reschedule Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
