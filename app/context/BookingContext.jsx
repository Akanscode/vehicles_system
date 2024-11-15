// contexts/BookingContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { getBookingsByOwner, updateBookingStatus } from '../firebase/firestoreBookings';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        if (role === 'vehicleOwner') {
          const ownerBookings = await getBookingsByOwner(user.uid);
          setBookings(ownerBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, role]);

  return (
    <BookingContext.Provider value={{ bookings, loading, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);
