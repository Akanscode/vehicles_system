// app/api/tasks/postTasks/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const newTask = await request.json();
    const docRef = await addDoc(collection(db, "tasks"), newTask);
    return new Response(JSON.stringify({ id: docRef.id, ...newTask }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding task:", error.message);
    return new Response(JSON.stringify({ message: "Failed to add task", error: error.message }), {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
    });
  }
}
