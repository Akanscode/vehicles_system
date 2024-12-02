'use client';
import React, { useState, useEffect } from "react";
import { auth, db } from "@/app/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import BookingFormModal from "./components/BookingFormModal";
import PendingTasks from "./components/PendingTasks";

const VehicleOwnerDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
          } else {
            console.log('No user document found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    document.title = "Vehicle Owner Dashboard | MyApp";
  }, []);

  const openBookingModal = () => setIsModalOpen(true);
  const closeBookingModal = () => setIsModalOpen(false);

  // Show loading message while data is being fetched
  if (authLoading || loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Vehicle Owner Dashboard</h2>

      {userData && (
        <div className="mb-6">
          <p className="text-lg font-medium">Welcome, {userData.name}</p>
          <p className="text-sm text-gray-600">Email: {userData.email}</p>
        </div>
      )}

      <button
        onClick={openBookingModal}
        className="mb-4 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-lg hover:from-blue-600 hover:to-green-600"
        aria-label="Book a Service"
      >
        Book a Service
      </button>

      {isModalOpen && <BookingFormModal onClose={closeBookingModal} refreshTasks={() => {}} />}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
        <PendingTasks userId={userId} />
      </div>
    </div>
  );
};

export default VehicleOwnerDashboard;
