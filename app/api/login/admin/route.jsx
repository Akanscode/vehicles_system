
//api/login/admin/route.jsx
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      // Hardcoded admin credentials
      const adminEmail = 'admin@admin.com';
      const adminPassword = 'admin1234';
  
      // Check if the provided credentials match the admin's
      if (email === adminEmail && password === adminPassword) {
        return res.status(200).json({
          message: 'Admin login successful',
          user: {
            email: adminEmail,
            role: 'admin',
          },
        });
      }
  
      return res.status(401).json({ message: 'Invalid admin credentials' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  