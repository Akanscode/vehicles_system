import { db } from "@/app/firebase/firebaseConfig";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { userSchema } from "@/app/utils/userSchema";

export async function POST(request) {
  try {
    // Log Firestore initialization
    console.log("Firestore Initialized:", db);

    // Parse and validate the request body
    const body = await request.json();
    console.log("Received body:", body);

    const parsedBody = userSchema.safeParse(body);

    if (!parsedBody.success) {
      console.log("Validation errors:", parsedBody.error.errors);
      return new Response(
        JSON.stringify({ error: parsedBody.error.errors }),
        { status: 400 }
      );
    }

    const { first_name, last_name, email, password, phone, vehicleType, role } = parsedBody.data;

    if (!["vehicleOwner", "admin"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role" }),
        { status: 400 }
      );
    }

    const userQuery = query(collection(db, "users"), where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };

    if (role === "vehicleOwner") {
      userData.vehicleType = vehicleType;
    }

    const newUserRef = await addDoc(collection(db, "users"), userData);
    console.log("New user added with ID:", newUserRef.id);

    return new Response(
      JSON.stringify({
        id: newUserRef.id,
        first_name,
        last_name,
        email,
        phone,
        role,
        vehicleType: role === "vehicleOwner" ? vehicleType : null,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in user registration:", error);

    return new Response(
      JSON.stringify({ error: "Failed to register user. Please try again." }),
      { status: 500 }
    );
  }
}
