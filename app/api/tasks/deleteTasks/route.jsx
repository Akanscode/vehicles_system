// app/api/tasks/deleteTasks/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await deleteDoc(doc(db, "tasks", id));
    return new Response(JSON.stringify({ id }), { status: 204 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response("Failed to delete task", { status: 500 });
  }
}
