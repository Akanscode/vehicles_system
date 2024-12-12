import { NextResponse } from 'next/server';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get('uid');  // This should be the userId you're passing from the frontend

  if (!uid) {
    return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
  }

  try {
    const bookingsRef = collection(db, 'bookings');
    // Query using 'userId' instead of 'currentUserId'
    const q = query(bookingsRef, where('uid', '==', uid)); // Use 'userId'
    const querySnapshot = await getDocs(q);

    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
