// api/signup/route.js
export async function POST(request) {
    try {
      const body = await request.json();
      const parsedBody = userSchema.safeParse(body);
  
      if (!parsedBody.success) {
        return new Response(JSON.stringify({ error: parsedBody.error.errors }), { status: 400 });
      }
  
      const { first_name, last_name, email, password, phone, vehicleModel } = parsedBody.data;
      const userSnapshot = await getDocs(collection(db, 'users'));
      const emailExists = userSnapshot.docs.some((doc) => doc.data().email === email);
      if (emailExists) {
        return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 400 });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await addDoc(collection(db, 'users'), {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone,
        vehicleModel,
        role: 'vehicleOwner',
      });
  
      return new Response(
        JSON.stringify({ id: newUser.id, first_name, last_name, email, phone, vehicleModel }),
        { status: 201 }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to register user' }), { status: 500 });
    }
  }
  