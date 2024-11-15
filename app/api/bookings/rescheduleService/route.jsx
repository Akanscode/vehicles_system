import { db } from "@/app/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function PUT(req) {
  const { bookingId, newDate } = await req.json();

  try {
    const bookingRef = doc(db, 'bookings', bookingId); // Reference to the specific booking document
    await updateDoc(bookingRef, { date: newDate, status: 'rescheduled' }); // Update date and status

    return new Response(JSON.stringify({ message: "Booking rescheduled successfully" }), { status: 200 });
  } catch (error) {
    console.error("Reschedule error:", error);
    return new Response(JSON.stringify({ error: "Failed to reschedule" }), { status: 500 });
  }
}
