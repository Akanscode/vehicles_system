'use client';
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import required Firebase methods
import { db } from "@/app/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import BookingFormModal from "./components/BookingFormModal";
import PendingTasks from "./components/PendingTasks";

const VehicleOwnerDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [uid, setUid] = useState(null); // Declare state for UID

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          console.error("User document not found.");
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
        setUserData(null);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Set the UID when user is authenticated
        fetchUserData(user); // Fetch user data after setting UID
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const openBookingModal = () => setIsModalOpen(true);
  const closeBookingModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Vehicle Owner Dashboard</h2>
      {userData ? (
        <div className="mb-6">
          <p className="text-lg font-medium">Welcome, {userData.first_name}</p>
          <p className="text-sm text-gray-600">Email: {userData.email}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Loading user data...</p>
      )}

      <button
        onClick={openBookingModal}
        className="mb-4 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-lg hover:from-blue-600 hover:to-green-600"
        aria-label="Book a Service"
      >
        Book a Service
      </button>
      {isModalOpen && (
        <BookingFormModal
          onClose={closeBookingModal}
          userDocId={userData?.id || ""}
        />
      )}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
        {uid && <PendingTasks uid={uid} />} {/* Ensure uid is defined before passing */}
      </div>
    </div>
  );
};

export default VehicleOwnerDashboard;
