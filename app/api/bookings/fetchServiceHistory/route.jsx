
///api/bookings/fetchserviceHistory/route.jsx
import { db } from "@/app/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
  }

  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      where('status', 'in', ['completed', 'rescheduled'])
    );
    const snapshot = await getDocs(q);
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(history), { status: 200 });
  } catch (error) {
    console.error("Fetch service history error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch service history" }), { status: 500 });
  }
}

