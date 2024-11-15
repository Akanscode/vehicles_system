import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { employeeId, taskId, taskDescription } = await req.json();

    // Assuming fetchEmployeeById function exists
    const employee = await fetchEmployeeById(employeeId);

    if (!employee || !employee.email) {
      return new Response(JSON.stringify({ error: "Employee email not found." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Updated to server-only environment variable
        pass: process.env.EMAIL_PASS, // Updated to server-only environment variable
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: "New Task Assignment Notification",
      text: `Hello ${employee.name},\n\nYou have been assigned a new task.\n\nTask ID: ${taskId}\nDescription: ${taskDescription}\n\nPlease check your dashboard for more details.\n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Notification email sent successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email notification." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
