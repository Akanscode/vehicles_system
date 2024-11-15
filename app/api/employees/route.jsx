import { db } from "@/app/firebase/firebaseConfig";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  addDoc, 
  updateDoc 
} from "firebase/firestore";

// Handle GET requests to fetch all employees
export async function GET() {
  try {
    const employeesCollection = collection(db, 'employees');
    const employeesSnapshot = await getDocs(employeesCollection);
    const employeesList = employeesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify(employeesList), { status: 200 });
  } catch (error) {
    console.error('Error fetching employees:', error); // Log the error to the console
    return new Response(JSON.stringify({ error: 'Failed to fetch employees' }), { status: 500 });
  }
}

// Handle POST requests to add a new employee
export async function POST(request) {
  try {
    const employeeData = await request.json();
    
    // Add the new employee to the Firestore collection
    const docRef = await addDoc(collection(db, 'employees'), employeeData);
    
    // Return success response with the new employee ID
    return new Response(JSON.stringify({ success: true, id: docRef.id }), { status: 201 });
  } catch (error) {
    console.error("Error adding employee: ", error); // Log the error for debugging
    return new Response(JSON.stringify({ error: 'Failed to add employee' }), { status: 500 });
  }
}

// Handle PUT requests to update an existing employee
export async function PUT(request) {
  try {
    const { id, ...updatedData } = await request.json();
    const employeeDoc = doc(db, 'employees', id);
    await updateDoc(employeeDoc, updatedData);
    return new Response(JSON.stringify({ id, ...updatedData }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update employee' }), { status: 500 });
  }
}

// Handle DELETE requests to remove an employee
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await deleteDoc(doc(db, 'employees', id));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete employee' }), { status: 500 });
  }
}
