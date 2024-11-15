'use client';
import { useState } from 'react';
import { showToast } from '@/app/components/toast';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth if not done globally

const BookingFormModal = ({ onClose, refreshBookings }) => {
  const [serviceType, setServiceType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve user ID from Firebase Auth
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserId = currentUser ? currentUser.uid : null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings/createBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId, // Pass the userId
          serviceType,
          vehicleType,
          date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create booking:", errorData);
        setError(`Failed to create booking: ${errorData.error}`);
        return;
      }

      if (typeof refreshBookings === 'function') {
        await refreshBookings();
      }

      showToast('Booking created successfully');
      setTimeout(onClose, 1000);
    } catch (error) {
      setError('Error creating booking');
      showToast('Error creating booking');
      console.error("Error creating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Book a Service
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
            >
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-4">
            <form onSubmit={handleBookingSubmit} className="booking-form">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-600">{error}</p>}

              <label htmlFor="serviceType" className="mt-4 block">Select Service Type:</label>
              <select
                id="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="">Select Service Type</option>
                <option value="oil-change">Oil Change</option>
                <option value="tire-change">Tire Change</option>
              </select>

              <label htmlFor="vehicleType" className="mt-4 block">Select Vehicle Type:</label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
                className="block w-full mt-1 p-2 border rounded"
              >
                <option value="">Select Vehicle Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
              </select>

              <label htmlFor="scheduledDate" className="mt-4 block">Select Date:</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)} 
                required
                className="block w-full mt-1 p-2 border rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full gradient-200 text-white py-2 rounded hover:gradient-100"
              >
                {loading ? 'Booking...' : 'Book Service'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
