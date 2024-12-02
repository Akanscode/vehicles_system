import { db } from '@/app/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs'; // Import bcrypt

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Parse JSON body

    // Query Firestore for vehicle owner user
    const q = query(
      collection(db, 'users'),
      where('email', '==', email),
      where('role', '==', 'vehicleOwner')
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    const ownerData = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;  // Assuming user ID is in Firestore document ID

    // Check if the hashed password matches
    const isPasswordValid = await bcrypt.compare(password, ownerData.password); // Use bcrypt to compare hashes
    if (isPasswordValid) {
      return new Response(
        JSON.stringify({
          message: 'Vehicle owner login successful',
          user: { ...ownerData, userId },  // Send user data with userId
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Invalid password' }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error during vehicle owner login:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
