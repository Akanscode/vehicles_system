'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { showToast } from '@/app/components/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Circles } from 'react-loader-spinner';
import { useState } from 'react';

// Schema for form validation
const SignupSchema = z.object({
  first_name: z.string().nonempty({ message: 'First name is required' }),
  last_name: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirm_password: z.string().min(8, { message: 'Password confirmation is required' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  vehicleType: z.string().nonempty({ message: 'Vehicle type is required' }),
}).refine((data) => data.password === data.confirm_password, {
  path: ['confirm_password'],
  message: 'Passwords must match',
});

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Remove confirm_password from data before sending to backend
      const { confirm_password, ...userData } = data;

      // Append the role as 'vehicleOwner' explicitly
      userData.role = 'vehicleOwner';

      // Send data to the API
      const response = await fetch('/api/users/createUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.[0]?.message || 'Registration failed');
      }

      showToast('Registration successful. Please log in.', 'success');
      router.push('/auth/login');
    } catch (error) {
      showToast('Registration failed: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto w-full">
      <div className="py-6 md:py-12">
        <div className="max-w-md w-full mx-auto mt-10">
          <h3 className="text-center">Sign Up</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            {/* Common Fields */}
            {['first_name', 'last_name', 'email', 'phone'].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm capitalize">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  {...register(field)}
                  className="w-full px-3 py-2 border rounded-md text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 sm:text-sm sm:leading-6"
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]?.message}</p>}
              </div>
            ))}

            {/* Vehicle Type Field */}
            <div className="space-y-2">
              <label htmlFor="vehicleType" className="block text-sm">Vehicle Type</label>
              <input
                type="text"
                {...register("vehicleType")}
                className="w-full px-3 py-2 border rounded-md text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 sm:text-sm"
              />
              {errors.vehicleType && <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>}
            </div>

            {/* Password Fields */}
            {['password', 'confirm_password'].map((field) => (
              <div key={field} className="space-y-2">
                <label htmlFor={field} className="block text-sm capitalize">
                  {field.replace('_', ' ')}
                </label>
                <input
                  type="password"
                  {...register(field)}
                  className="w-full px-3 py-2 border rounded-md text-black ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 sm:text-sm sm:leading-6"
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]?.message}</p>}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <Circles height="20" width="20" color="#ffffff" ariaLabel="loading" />
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Link to Login */}
            <div className="text-center">
              <p>
                Already have an account? <Link href="/auth/login" className="text-teal-500">Login here</Link>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
