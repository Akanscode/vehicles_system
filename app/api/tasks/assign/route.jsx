import { db } from "@/app/firebase/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import nodemailer from "nodemailer";

// This function is for the PUT method to assign tasks to employees
export async function PUT(req) {
  try {
    const { taskId, employeeId, taskDescription } = await req.json();

    // Step 1: Get reference to the task document in Firestore
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    // Step 2: Check if the task exists
    if (!taskSnap.exists()) {
      return new Response("Task not found", { status: 404 });
    }

    // Step 3: Fetch employee details using employeeId
    const employeeRef = doc(db, "employees", employeeId);
    const employeeSnap = await getDoc(employeeRef);

    if (!employeeSnap.exists()) {
      return new Response("Employee not found", { status: 404 });
    }

    const employee = employeeSnap.data();

    // Step 4: Update the task document with the assigned employee
    await updateDoc(taskRef, {
      assignedEmployee: employeeId,
    });

    // Step 5: Send email notification to the employee
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:  process.env.EMAIL_USER,
        pass:  process.env.EMAIL_PASS
      },
    });

    const mailOptions = {
      from:  process.env.EMAIL_USER,
      to: employee.email,
      subject: "New Task Assigned to You",
      text: `Hello ${employee.name},\n\nYou have been assigned a new task.\n\nTask ID: ${taskId}\nDescription: ${taskDescription}\n\nPlease check your dashboard for more details.\n\nBest regards,\nYour Team`,
    };

    // Step 6: Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return new Response(JSON.stringify({ message: "Task assigned and notification sent successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error assigning task or sending email:", error);
    return new Response("Failed to assign task or send email", { status: 500 });
  }
}
