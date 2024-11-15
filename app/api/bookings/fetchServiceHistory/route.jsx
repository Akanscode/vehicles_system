import { db } from "@/app/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('status', 'in', ['completed', 'rescheduled']));
    const snapshot = await getDocs(q);
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return new Response(JSON.stringify(history), { status: 200 });
  } catch (error) {
    console.error("Fetch history error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch service history" }), { status: 500 });
  }
}
