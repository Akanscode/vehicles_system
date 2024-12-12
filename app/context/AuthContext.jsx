'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/components/toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const registerUser = async (first_name, last_name, email, password, phone, vehicleType) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      if (!newUser) throw new Error('User registration failed. No user returned.');

      // Create user document in Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        first_name,
        last_name,
        email,
        phone,
        vehicleType,
        role: 'vehicleOwner',  // Default role set to 'customer'
      });

      setUser(newUser);
      showToast('User registered successfully', 'success');

      // Redirect to login page after successful registration
      router.push('/auth/login');

      return newUser; // Return the new user for further actions (if any)
    } catch (error) {
      showToast('Registration failed: ' + error.message, 'error');
      return null;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      if (!loggedInUser) throw new Error('User login failed. No user returned.');

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', loggedInUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if the role is defined
        if (!userData.role) throw new Error('User role is undefined. Please contact support.');

        // Set user data in context, including role
        setUser({ ...loggedInUser, role: userData.role });
        showToast('Login successful!', 'success');

        // Redirect based on user role
        if (userData.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/ownerdashboard');
        }
      } else {
        throw new Error('User data not found in Firestore.');
      }
    } catch (error) {
      showToast('Login failed: ' + error.message, 'error');
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset user context
      showToast('Logged out successfully', 'success');
      router.push('/auth/login');
    } catch (error) {
      showToast('Logout failed: ' + error.message, 'error');
    }
  };

  return (
    <AuthContext.Provider value={{ user, registerUser, loginUser, logoutUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
