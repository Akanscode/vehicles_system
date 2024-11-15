// app/api/tasks/updateTasks/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function PATCH(request) {
  try {
    const { id, updates } = await request.json();
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, updates);
    return new Response(JSON.stringify({ id, updates }), { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response("Failed to update task", { status: 500 });
  }
}
