//api/users/fetchUSers/route.jsx
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    // Reference the 'users' collection in Firestore using the modular approach
    const usersCollectionRef = collection(db, "users");

    // Fetch all documents from the 'users' collection
    const userSnapshot = await getDocs(usersCollectionRef);

    // Map through the snapshot to extract each user's data
    const users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the users in JSON format with a 200 (OK) status
    return new Response(
      JSON.stringify({ users }), // JSON stringify the users
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return a 500 response with an error message if something goes wrong
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
