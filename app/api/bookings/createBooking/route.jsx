import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const { uid, serviceType, vehicleType, date } = await req.json();

    console.log("Received booking data:", { uid, serviceType, vehicleType, date });

    // Validate required fields
    if (!uid || !serviceType || !vehicleType || !date) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: uid, serviceType, vehicleType, and date are mandatory.",
        }),
        { status: 400 }
      );
    }

    // Reference the top-level bookings collection
    const bookingsCollectionRef = collection(db, "bookings");

    // Create booking data
    const bookingData = {
      uid,
      serviceType,
      vehicleType,
      date,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    console.log("Booking data to be added:", bookingData);

    // Add booking to Firestore
    const bookingDocRef = await addDoc(bookingsCollectionRef, bookingData);

    console.log("Booking successfully added with ID:", bookingDocRef.id);

    return new Response(
      JSON.stringify({ message: "Booking created successfully.", bookingId: bookingDocRef.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create booking. Please try again later." }),
      { status: 500 }
    );
  }
}
