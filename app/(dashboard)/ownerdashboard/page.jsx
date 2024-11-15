// app/dashboard/VehicleOwnerDashboard.js
'use client';
import React, { useState, useEffect } from "react";
import { auth } from "@/app/firebase/firebaseConfig";
import BookingFormModal from "./components/BookingFormModal";
import PendingTasks from "./components/PendingTasks";

const VehicleOwnerDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  // Set user ID on initial load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to open booking modal
  const openBookingModal = () => setIsModalOpen(true);

  // Function to close booking modal
  const closeBookingModal = () => setIsModalOpen(false);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vehicle Owner Dashboard</h2>

      {/* Button to open the booking form modal */}
      <button
        onClick={openBookingModal}
        className="mb-4 px-5 py-2.5 text-sm font-medium text-white rounded-lg gradient-100 hover:gradient-200"
      >
        Book a Service
      </button>

      {/* Render BookingFormModal only when isModalOpen is true */}
      {isModalOpen && (
        <BookingFormModal onClose={closeBookingModal} />
      )}

      {/* Pending tasks section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
        <PendingTasks userId={userId} /> {/* Pass userId as prop */}
      </div>
    </div>
  );
};

export default VehicleOwnerDashboard;
