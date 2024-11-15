'use client';
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay, parseISO } from 'date-fns';

const BookingForm = ({ user }) => {
  const [serviceType, setServiceType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const q = query(collection(db, 'availableDates'));
        const dateSnapshot = await getDocs(q);
        const fetchedDates = dateSnapshot.docs.map(doc => doc.data().date.toDate().toISOString());

        setAvailableDates(fetchedDates);
        setError(null); // Reset error if fetch is successful
      } catch (err) {
        console.error(err); // Log the error for debugging
        // Set default available dates in case of an error (e.g., next few days)
        const defaultDates = Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date.toISOString();
        });
        setAvailableDates(defaultDates);
        setError('Error fetching available dates, using default dates.');
      }
    };
    fetchAvailableDates();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!serviceType || !vehicleType || !selectedDate) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'bookings'), {
        ownerId: user.uid,
        serviceType,
        vehicleType,
        scheduledDate: selectedDate,
        status: 'pending',
      });
      setSuccessMessage('Booking successful!');
      setError(null);
    } catch (err) {
      setError('Error submitting booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date) => {
    return availableDates.some((availableDate) => 
      isSameDay(date, parseISO(availableDate))
    );
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block text-white gradient-100 hover:gradient-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Book a Service
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Book a Service
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
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
                <form onSubmit={handleBooking} className="booking-form">
                  {loading && <p>Loading...</p>}
                  {error && <p className="text-red-500">{error}</p>}
                  {successMessage && <p className="text-green-500">{successMessage}</p>}

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
                  <DatePicker
                    id="scheduledDate"
                    selected={selectedDate}
                    onChange={(date) => {
                      console.log(date); // Debugging the selected date
                      setSelectedDate(date);
                    }}
                    filterDate={isDateAvailable}
                    required
                    className="block w-full mt-1 p-2 border rounded"
                    placeholderText="Select a date"
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
      )}
    </>
  );
};

export default BookingForm;
