// app/api/serviceHistory/route.js
import { db } from "@/app/firebase/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export async function GET(request) {
  const historySnapshot = await getDocs(collection(db, "serviceHistory"));
  const serviceHistory = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return new Response(JSON.stringify(serviceHistory), { status: 200 });
}

export async function POST(request) {
  const newService = await request.json();
  const docRef = await addDoc(collection(db, "serviceHistory"), newService);
  return new Response(JSON.stringify({ id: docRef.id, ...newService }), { status: 201 });
}

export async function PATCH(request) {
  const { id, updates } = await request.json();
  const serviceRef = doc(db, "serviceHistory", id);
  await updateDoc(serviceRef, updates);
  return new Response(JSON.stringify({ id, updates }), { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  await deleteDoc(doc(db, "serviceHistory", id));
  return new Response(JSON.stringify({ id }), { status: 204 });
}
