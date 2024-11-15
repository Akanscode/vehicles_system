// app/api/tasks/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export async function GET(request) {
  const tasksSnapshot = await getDocs(collection(db, "tasks"));
  const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return new Response(JSON.stringify(tasks), { status: 200 });
}

export async function POST(request) {
  const newTask = await request.json();
  const docRef = await addDoc(collection(db, "tasks"), newTask);
  return new Response(JSON.stringify({ id: docRef.id, ...newTask }), { status: 201 });
}

export async function PATCH(request) {
  const { id, updates } = await request.json();
  const taskRef = doc(db, "tasks", id);
  await updateDoc(taskRef, updates);
  return new Response(JSON.stringify({ id, updates }), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  await deleteDoc(doc(db, "tasks", id));
  return new Response(JSON.stringify({ id }), { status: 204 });
}
