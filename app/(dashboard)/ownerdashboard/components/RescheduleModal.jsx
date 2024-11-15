'use client';
import { useState } from 'react';

const RescheduleModal = ({ bookingId, onClose, refreshTasks }) => {
  const [newDate, setNewDate] = useState('');

  const handleReschedule = async () => {
    try {
      await fetch('/api/bookings/rescheduleService', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, newDate })
      });
      refreshTasks(); // Refresh tasks after reschedule
      onClose(); // Close the modal
    } catch (error) {
      console.error("Reschedule error:", error);
    }
  };

  return (
    <div className="modal">
      <input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <button onClick={handleReschedule}>Reschedule</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default RescheduleModal;
