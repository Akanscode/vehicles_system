///api/bookings/updateBookings/route.jsx
import { db } from "@/app/firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { parseISO, isBefore, startOfToday } from "date-fns";

export async function POST(request) {
  const { userId } = await request.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
  }

  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("userId", "==", userId), where("status", "==", "pending"));
    const snapshot = await getDocs(q);

    const today = startOfToday();

    const updates = snapshot.docs.map(async (docSnap) => {
      const bookingData = docSnap.data();
      const bookingDate = parseISO(bookingData.date);

      if (isBefore(bookingDate, today)) {
        const bookingRef = doc(db, "bookings", docSnap.id);
        await updateDoc(bookingRef, { status: "completed" });
      }
    });

    await Promise.all(updates);

    return new Response(JSON.stringify({ message: "Bookings updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Update bookings error:", error);
    return new Response(JSON.stringify({ error: "Failed to update bookings" }), { status: 500 });
  }
}
