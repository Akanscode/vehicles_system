'use client'
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react'
import PendingTasks from '../components/PendingTasks'

const PendingTaskPage = () => {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Fetch UID from Firebase Auth
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
    {uid ? <PendingTasks uid={uid} /> : <p>Loading user data...</p>}
    </div>
  )
}

export default PendingTaskPage
