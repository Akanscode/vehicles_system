import { z } from 'zod';

export const userSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  phone: z.string().regex(/^\d+$/, { message: "Phone number should only contain digits" }),
  role: z.enum(['vehicleOwner', 'admin'], { required_error: 'Role is required' }),
  vehicleType: z.string().min(1, { message: "Vehicle model is required" }).optional(),
}).refine((data) => {
  if (data.role === 'vehicleOwner') {
    return data.vehicleType && data.vehicleType.length > 0;
  }
  return true;
}, {
  path: ['vehicleType'], // Ensure this path matches the field name
  message: 'Vehicle model is required for vehicle owners',
});
