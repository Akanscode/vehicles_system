import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  const { serviceType, vehicleType, date, userId } = await req.json();

  try {
    await addDoc(collection(db, 'bookings'), {
      userId,          // Add userId to the booking document
      serviceType,
      vehicleType,
      date,
      status: 'pending',
    });
    return new Response(JSON.stringify({ message: "Booking created successfully" }), { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return new Response(JSON.stringify({ error: "Failed to create booking" }), { status: 500 });
  }
}
