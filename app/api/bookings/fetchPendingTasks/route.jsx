// api/bookings/fetchPendingTasks/route.jsx
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
  }

  try {
    const tasksRef = collection(db, "bookings");
    const q = query(tasksRef, where("userId", "==", userId), where("status", "==", "pending"));
    const snapshot = await getDocs(q);

    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), { status: 500 });
  }
}
