// api/users/createUsers/route.jsx
import { db } from "@/app/firebase/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs"; // Ensure bcrypt is installed
import { userSchema } from "@/app/utils/userSchema";

export async function POST(request) {
  try {
    // Parse incoming request body and validate using userSchema
    const body = await request.json();
    console.log("Received body:", body); // Log the entire request body for debugging

    const parsedBody = userSchema.safeParse(body);

    // Validate schema, return error if validation fails
    if (!parsedBody.success) {
      console.log("Validation errors:", parsedBody.error.errors); // Log validation errors
      return new Response(
        JSON.stringify({ error: parsedBody.error.errors }),
        { status: 400 }
      );
    }

    const { first_name, last_name, email, password, phone, vehicleType, role } = parsedBody.data;

    // Check if email is already registered using a Firestore query
    const userQuery = query(collection(db, "users"), where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);
    if (!userSnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400 }
      );
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data for Firestore
    const userData = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };

    // Conditionally include vehicleModel if role is 'vehicleOwner'
    if (role === 'vehicleOwner') {
      userData.vehicleType = vehicleType;
    }

    // Add new user to Firestore
    const newUserRef = await addDoc(collection(db, "users"), userData);

    // Respond with user data (excluding password)
    return new Response(
      JSON.stringify({
        id: newUserRef.id,
        first_name,
        last_name,
        email,
        phone,
        role,
        vehicleType: role === 'vehicleOwner' ? vehicleType : null,
      }),
      { status: 201 }
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Error in user registration:", error);
    return new Response(
      JSON.stringify({ error: "Failed to register user. Please try again." }),
      { status: 500 }
    );
  }
}
