// AuthContext.jsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { showToast } from '@/app/components/toast';
import bcrypt from 'bcryptjs'; // Ensure bcryptjs is installed

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const registerUser = async (email, password, additionalData) => {
    try {
      // Step 1: Register with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      console.log("User registered with Firebase Auth:", userId);
  
      // Step 2: Hash the password before saving to Firestore
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
  
      // Step 3: Save additional user data to Firestore
      await db.collection('users').doc(userId).set({
        first_name: additionalData.first_name,
        last_name: additionalData.last_name,
        email: email,
        password: hashedPassword, // Store hashed password
        phone: additionalData.phone,
        vehicleModel: additionalData.vehicleModel || '',
        role: additionalData.role || 'vehicleOwner',
        createdAt: new Date().toISOString(),
      });
      console.log("User data saved to Firestore successfully");
  
      return userCredential;
    } catch (error) {
      console.error("Detailed error:", error);
  
      // Displaying error message using showToast if it's defined
      if (typeof showToast === 'function') {
        showToast("Registration failed: " + error.message);
      }
      throw new Error(error.message); // Propagate the error to caller
    }
  };
  
  

  const loginUser = async (email, password) => {
    try {
      // Query Firestore to get the user by email
      const usersCollection = db.collection('users');
      const userSnapshot = await usersCollection.where('email', '==', email).get();

      if (userSnapshot.empty) {
        showToast('Invalid email or password.');
        return;
      }

      const userData = userSnapshot.docs[0].data();

      // Compare provided password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        showToast('Invalid email or password.');
        return;
      }

      // Log in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);

      if (userData.role === 'admin') {
        showToast('Admin logged in successfully');
        router.push('/admin');
      } else {
        showToast('Logged in successfully');
        router.push('/ownerdashboard');
      }
    } catch (error) {
      showToast('Login failed: ' + error.message);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      showToast('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      showToast('Logout failed: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, registerUser, loginUser, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
