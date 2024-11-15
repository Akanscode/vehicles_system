// api/users/fetchUsers/route.js
// api/users/fetchUsers/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const userSnapshot = await getDocs(collection(db, 'users'));

    // Map the users to retrieve only necessary fields
    const users = userSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        password: data.password, // hashed password
      };
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
  }
}
