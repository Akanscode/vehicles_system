'use client';
import { useState, useEffect } from 'react';
import { showToast } from '@/app/components/toast';
import { getAuth } from 'firebase/auth';

const BookingFormModal = ({ onClose, userDocId }) => {
  const [serviceType, setServiceType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);  // user state to store user info

  useEffect(() => {
    // Get current user from Firebase authentication
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser); // Correctly set the user state from Firebase Auth
    }
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if the user is authenticated
      if (!user || !userDocId) {
        throw new Error('User not authenticated or invalid user document ID.');
      }

      // Validate input fields
      if (!serviceType || !vehicleType || !date) {
        throw new Error('Please fill in all required fields.');
      }

      const response = await fetch('/api/bookings/createBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,  // Pass the authenticated user's uid
          serviceType,
          vehicleType,
          date,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create booking.');
      }

      showToast('Booking created successfully!', 'success');
      setTimeout(onClose, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the booking.');
      showToast(err.message || 'Error creating booking.', 'error');
    } finally {
      setLoading(false);
    }
};


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md max-h-full p-4">
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Book a Service
            </h3>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
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
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-center">Booking in progress...</p>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                {error && <p className="text-red-600">{error}</p>}
                <label htmlFor="serviceType" className="block mt-4">
                  Service Type:
                </label>
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

                <label htmlFor="vehicleType" className="block mt-4">
                  Vehicle Type:
                </label>
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

                <label htmlFor="scheduledDate" className="block mt-4">
                  Select Date:
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="block w-full mt-1 p-2 border rounded"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 w-full gradient-200 text-white py-2 rounded ${
                    loading ? 'cursor-not-allowed' : 'hover:gradient-100'
                  }`}
                >
                  {loading ? 'Booking...' : 'Book Service'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
