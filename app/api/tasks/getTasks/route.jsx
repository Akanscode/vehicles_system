// app/api/tasks/getTasks/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return new Response(JSON.stringify({ message: "Failed to fetch tasks", error: error.message }), {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
    });
  }
}
