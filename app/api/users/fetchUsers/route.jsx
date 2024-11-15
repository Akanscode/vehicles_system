// app/api/users/getUsers/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    // Reference the 'users' collection in Firestore
    const usersCollection = collection(db, "users");

    // Fetch all documents from the 'users' collection
    const userSnapshot = await getDocs(usersCollection);

    // Map through the snapshot to extract each user's data
    const users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the users in JSON format with a 200 (OK) status
    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Log error for server-side debugging
    console.error("Error fetching users:", error);

    // Return a user-friendly error message with a 500 status
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching users. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
