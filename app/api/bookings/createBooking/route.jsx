import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { serviceType, vehicleType, date, userId } = await req.json();

    console.log("Received booking data:", { serviceType, vehicleType, date, userId });

    // Validate required fields
    if (!serviceType || !vehicleType || !date) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: serviceType, vehicleType, and date are mandatory.",
        }),
        { status: 400 }
      );
    }

    // Validate userId
    if (!userId) {
      console.error("User ID is missing.");
      return new Response(
        JSON.stringify({ error: "User ID is required to create a booking." }),
        { status: 400 }
      );
    }

    // Create booking data
    const bookingData = {
      userId,
      serviceType,
      vehicleType,
      date,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    console.log("Booking data to be added:", bookingData);

    // Add booking to Firestore
    await addDoc(collection(db, "bookings"), bookingData);

    console.log("Booking successfully added to Firestore.");

    return new Response(
      JSON.stringify({ message: "Booking created successfully." }),
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
