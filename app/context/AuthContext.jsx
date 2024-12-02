'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/components/toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // Track user role
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;

        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }

        setUser(currentUser);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Vehicle owner signup
  const registerVehicleOwner = async (email, password, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        ...additionalData,
        email,
        role: 'vehicleOwner',
        createdAt: new Date().toISOString(),
      });

      showToast('Registration successful');
      return userCredential;
    } catch (error) {
      console.error('Registration failed:', error);
      showToast('Registration failed: ' + error.message);
      throw new Error(error.message);
    }
  };

  // Login logic (admin or vehicle owner)
  // Login logic (admin or vehicle owner)
const loginUser = async (email, password) => {
  try {
    // Check Firebase authentication for the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Fetch user details from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      showToast('User does not exist.');
      throw new Error('User not found in Firestore.');
    }

    // Get the role from Firestore
    const role = userDoc.data().role;

    // If the user is an admin (verify role)
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setUser({ email }); // Set admin user with email only
      setRole('admin'); // Admin role
      showToast('Admin logged in successfully');
      router.push('/admin'); // Redirect to admin dashboard
      return;
    }

    // If it's a vehicle owner, proceed as usual
    if (role === 'vehicleOwner') {
      setUser(userCredential.user);
      setRole('vehicleOwner');
      showToast('Vehicle Owner logged in successfully');
      router.push('/ownerdashboard'); // Redirect to vehicle owner dashboard
    } else {
      showToast('Unauthorized role.');
      throw new Error('Role mismatch.');
    }

  } catch (error) {
    console.error('Login failed:', error);
    showToast('Login failed: ' + error.message);
    throw error; // Re-throw error for further handling
  }
};

  
  

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      showToast('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Logout failed: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        registerVehicleOwner,
        loginUser,
        logoutUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
