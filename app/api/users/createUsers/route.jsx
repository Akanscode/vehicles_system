import { db } from '@/app/firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req) {
  const { uid, first_name, last_name, email, password, phone, vehicleType } = await req.json();

  try {
    // Create user in Firestore with default role as 'customer'
    await setDoc(doc(db, 'users', uid), {first_name, last_name, email, password, phone, vehicleType,  role: 'vehicleOwner' });
    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create user', details: error.message }), { status: 500 });
  }
}
